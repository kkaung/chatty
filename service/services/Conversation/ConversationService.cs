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
    }

    public async Task<ServiceResponse<List<GetConversationDto>>> GetUserConversations()
    {
        var response = new ServiceResponse<List<GetConversationDto>>();

        var uid = GetUserId();

        var conversations = await GetConversationsByUid(uid);

        response.Data = conversations.Select(c => _mapper.Map<GetConversationDto>(c)).ToList();

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
                    c.SenderOne!.Id == createConversation.fid
                    || c.SenderTwo!.Id == createConversation.fid
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

        // create a new conversation
        var conversation = new Conversation();
        conversation.SenderOne = new Friend()
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            ImageURL = user.ImageURL
        };
        conversation.SenderTwo = new Friend()
        {
            Id = friend.Id,
            Username = friend.Username,
            Email = friend.Email,
            ImageURL = friend.ImageURL
        };

        await _conversationsCollection.InsertOneAsync(conversation);

        var conversations = await GetConversationsByUid(uid);

        response.Data = conversations.Select(c => _mapper.Map<GetConversationDto>(c)).ToList();

        return response;
    }

    public async Task<ServiceResponse<GetConversationDto>> CreateMessage(
        string cid,
        CreateMessageDto createMessage
    )
    {
        var response = new ServiceResponse<GetConversationDto>();

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

        var message = _mapper.Map<Message>(createMessage);

        message.SenderId = sid;

        conversation.Messages.Add(message);

        await _conversationsCollection.ReplaceOneAsync(u => u.Id == conversation.Id, conversation);

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

    private async Task<List<Conversation>> GetConversationsByUid(string uid)
    {
        return await _conversationsCollection
            .Find(c => c.SenderOne!.Id == uid || c.SenderTwo!.Id == uid)
            .ToListAsync();
    }
}
