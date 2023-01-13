using System.Security.Claims;
using AutoMapper;
using Chatty.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Chatty.Services;

public class ConversationService : IConversationService
{
    private IHttpContextAccessor _httpContextAccessor;
    private IMongoCollection<Conversation> _conversationsCollection;
    private IMongoCollection<User> _usersCollection;
    private IMongoCollection<Message> _messagesCollection;
    private IMapper _mapper;

    public ConversationService(
        IHttpContextAccessor httpContextAccessor,
        IOptions<ChattyDatabaseSettings> chattyDatabaseSettings,
        IMapper mapper
    )
    {
        _httpContextAccessor = httpContextAccessor;
        _mapper = mapper;
        var mongoClient = new MongoClient(chattyDatabaseSettings.Value.ConnectionString);
        var db = mongoClient.GetDatabase(chattyDatabaseSettings.Value.DatabaseName);
        _conversationsCollection = db.GetCollection<Conversation>(
            chattyDatabaseSettings.Value.ConversationsCollectionName
        );
        _usersCollection = db.GetCollection<User>(chattyDatabaseSettings.Value.UsersCollectionName);
        _messagesCollection = db.GetCollection<Message>(
            chattyDatabaseSettings.Value.MessagesCollectionName
        );
    }

    public async Task<ServiceResponse<List<GetConversationDto>>> GetUserConversations()
    {
        var response = new ServiceResponse<List<GetConversationDto>>();

        var uid = GetUserId();

        var conversations = await GetConversationsByUid(uid);

        response.Data = conversations;

        return response;
    }

    public async Task<ServiceResponse<List<GetConversationDto>>> CreateUserConversation(
        CreateConversationDto createConversation
    )
    {
        var response = new ServiceResponse<List<GetConversationDto>>();

        var uid = GetUserId();

        if (uid == createConversation.fid)
        {
            response.Success = false;
            return response;
        }

        var conversationExists = await _conversationsCollection
            .Find(
                c =>
                    c.SenderOneId == createConversation.fid
                    || c.SenderTwoId == createConversation.fid
            )
            .FirstOrDefaultAsync();

        if (conversationExists is not null)
        {
            response.Message = "Conversation already exists";
            response.Success = false;
            return response;
        }

        var friend = await FindUserById(createConversation.fid!);
        var user = await FindUserById(uid);

        if (friend is null)
        {
            response.Message = "Friend not found";
            response.Success = false;
            return response;
        }

        // create a new conversation
        var conversation = new Conversation();
        conversation.SenderOneId = user.Id!;
        conversation.SenderTwoId = friend.Id!;

        await _conversationsCollection.InsertOneAsync(conversation);

        var conversations = await GetConversationsByUid(uid);

        response.Data = conversations;

        return response;
    }

    public async Task<ServiceResponse<GetConversationDto>> CreateMessage(
        string cid,
        CreateMessageDto createMessage
    )
    {
        var response = new ServiceResponse<GetConversationDto>();

        // get sender id
        var sid = GetUserId();

        var conversation = await _conversationsCollection
            .Find(c => c.Id == cid)
            .FirstOrDefaultAsync();

        if (conversation is null)
        {
            response.Success = false;
            response.Message = "Conversation not found";
            return response;
        }

        var newMessage = new Message() { Text = createMessage.Text, SenderId = sid };

        conversation.UpdatedAt = DateTime.Now;
        conversation.Messages.Add(newMessage);

        await _conversationsCollection.ReplaceOneAsync(c => c.Id == conversation.Id, conversation);

        response.Data = _mapper.Map<GetConversationDto>(conversation);

        return response;
    }

    private async Task<User> FindUserById(string id)
    {
        return await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    private string GetUserId()
    {
        return _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }

    private async Task<List<GetConversationDto>> GetConversationsByUid(string uid)
    {
        List<GetConversationDto> result = new List<GetConversationDto> { };
        var conversations = await _conversationsCollection
            .Find(c => c.SenderOneId == uid || c.SenderTwoId == uid)
            .ToListAsync();

        foreach (var c in conversations)
        {
            var mapConversation = _mapper.Map<GetConversationDto>(c);
            mapConversation.SenderOne = _mapper.Map<Friend>(await FindUserById(c.SenderOneId));
            mapConversation.SenderTwo = _mapper.Map<Friend>(await FindUserById(c.SenderTwoId));

            result.Add(mapConversation);
        }

        return result.OrderByDescending(r => r.UpdatedAt).ToList();
    }

    private async Task<GetConversationDto> GetConversation(string cid)
    {
        var conversation = await _conversationsCollection.Find(c => c.Id == cid).FirstAsync();

        var mapConversation = _mapper.Map<GetConversationDto>(conversation);

        mapConversation.SenderOne = _mapper.Map<Friend>(
            await FindUserById(conversation.SenderOneId)
        );
        mapConversation.SenderTwo = _mapper.Map<Friend>(
            await FindUserById(conversation.SenderTwoId)
        );

        return mapConversation;
    }

    private async Task<Message> FindMessageById(string id)
    {
        return await _messagesCollection.Find(m => m.Id == id).FirstOrDefaultAsync();
    }
}
