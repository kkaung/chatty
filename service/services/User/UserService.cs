using System.Security.Claims;
using AutoMapper;
using Chatty.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Chatty.Services;

public class UserService : IUserService
{
    private IMongoCollection<User> _usersCollection;
    private IMongoCollection<Conversation> _conversationsCollection;
    private IMapper _mapper;
    private IConfiguration _configuration;
    private IHttpContextAccessor _httpContextAccessor;

    public UserService(
        IOptions<ChattyDatabaseSettings> chattyDatabaseSettings,
        IMapper mapper,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
    {
        var mongoClient = new MongoClient(chattyDatabaseSettings.Value.ConnectionString);
        var db = mongoClient.GetDatabase(chattyDatabaseSettings.Value.DatabaseName);

        _usersCollection = db.GetCollection<User>(chattyDatabaseSettings.Value.UsersCollectionName);
        _conversationsCollection = db.GetCollection<Conversation>(
            chattyDatabaseSettings.Value.ConversationsCollectionName
        );
        _mapper = mapper;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ServiceResponse<List<GetUserDto>>> GetUsers(string q)
    {
        var response = new ServiceResponse<List<GetUserDto>>();

        List<User> users;

        if (q != "")
            users = await _usersCollection.Find(u => u.Username.Contains(q)).ToListAsync();
        else
            users = await _usersCollection.AsQueryable().ToListAsync();

        response.Data = users.Select(u => _mapper.Map<GetUserDto>(u)).ToList();

        return response;
    }

    public async Task<ServiceResponse<GetUserDto>> GetUserById(string id)
    {
        var response = new ServiceResponse<GetUserDto>();

        var user = await FindUserById(id);

        if (user is null)
        {
            response.Success = false;
            response.Message = "User not found";
            return response;
        }

        response.Data = _mapper.Map<GetUserDto>(user);

        return response;
    }

    public async Task<ServiceResponse<GetUserDto>> AddFriend(string id)
    {
        var response = new ServiceResponse<GetUserDto>();

        var uid = GetUserId();

        if (uid == id)
        {
            response.Success = false;
            response.Message = "You cannot add yourself as friend";
            return response;
        }

        var user = await FindUserById(uid);

        if (user is null)
        {
            response.Success = false;
            response.Message = "User not found";
            return response;
        }

        var friend = await FindUserById(id);

        if (friend is null)
        {
            response.Success = false;
            response.Message = "Friend not found";
            return response;
        }

        var friendExists = user.FriendIds.FirstOrDefault(fid => fid == id);

        if (friendExists is not null)
        {
            response.Success = false;
            response.Message = "Already firends";
            return response;
        }

        user.FriendIds.Add(id);

        await _usersCollection.ReplaceOneAsync(u => u.Id == GetUserId(), user);

        response.Data = _mapper.Map<GetUserDto>(user);

        response.Data.Friends = await FindFriends(user.FriendIds);

        return response;
    }

    public async Task<ServiceResponse<GetUserDto>> RemoveFriend(string id)
    {
        var response = new ServiceResponse<GetUserDto>();

        var uid = GetUserId();

        if (uid == id)
        {
            response.Success = false;
            response.Message = "You cannot remove yourself!";
            return response;
        }

        var user = await FindUserById(uid);

        if (user is null)
        {
            response.Success = false;
            response.Message = "User not found";
            return response;
        }

        var friend = user.FriendIds.FirstOrDefault(fid => fid == id);

        if (friend is null)
        {
            response.Success = false;
            response.Message = "Friend not found in list of friends";
            return response;
        }

        user.FriendIds = user.FriendIds.Where(fid => fid != id).ToList();

        await _usersCollection.ReplaceOneAsync(u => u.Id == GetUserId(), user);

        response.Data = _mapper.Map<GetUserDto>(user);

        response.Data.Friends = await FindFriends(user.FriendIds);

        return response;
    }

    public async Task<ServiceResponse<GetUserDto>> UpdateUser(UpdateUserDto update)
    {
        var response = new ServiceResponse<GetUserDto>();

        var uid = GetUserId();

        var user = await FindUserById(uid);

        if (update.Username != "")
            user.Username = update.Username;

        if (update.Email != "")
            user.Email = update.Email;

        if (update.ImageURL != "")
            user.ImageURL = update.ImageURL;

        if (update.Password != "")
        {
            HashPassword(update.Password, out byte[] passwordSalt, out byte[] passwordHash);
            user.PasswordSalt = passwordSalt;
            user.PasswordHash = passwordHash;
        }

        await _usersCollection.ReplaceOneAsync(u => u.Id == uid, user);

        var MapUser = _mapper.Map<GetUserDto>(user);

        response.Data = _mapper.Map<GetUserDto>(user);

        return response;
    }

    private string GetUserId()
    {
        return _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    }

    private async Task<User> FindUserById(string id)
    {
        return await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();
    }

    private void HashPassword(string password, out byte[] passwordSalt, out byte[] passwordHash)
    {
        using (var hmac = new System.Security.Cryptography.HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }

    private async Task<List<Friend>> FindFriends(List<string> ids)
    {
        List<Friend> friends = new List<Friend>() { };

        foreach (var id in ids)
        {
            var user = await _usersCollection.Find(u => u.Id == id).FirstOrDefaultAsync();

            if (user is not null)
                friends.Add(_mapper.Map<Friend>(user));
        }

        return friends;
    }
}
