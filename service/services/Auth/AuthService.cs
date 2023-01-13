using System.Security.Claims;
using AutoMapper;
using Chatty.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace Chatty.Services;

public class AuthService : IAuthService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly IMapper _mapper;
    private IConfiguration _configuration;
    private IHttpContextAccessor _httpContextAccessor;

    public AuthService(
        IOptions<ChattyDatabaseSettings> chattyDatabaseSettings,
        IMapper mapper,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
    {
        var mongoClient = new MongoClient(chattyDatabaseSettings.Value.ConnectionString);
        var db = mongoClient.GetDatabase(chattyDatabaseSettings.Value.DatabaseName);

        _usersCollection = db.GetCollection<User>(chattyDatabaseSettings.Value.UsersCollectionName);
        _mapper = mapper;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<ServiceResponse<GetUserDto>> Register(RegisterDto user)
    {
        var response = new ServiceResponse<GetUserDto>();

        if (await UserExists(user.Email))
        {
            response.Message = "User already registered";
            response.Success = false;
            return response;
        }

        var newUser = _mapper.Map<User>(user);

        HashPassword(user.Password, out byte[] passwordSalt, out byte[] passwordHash);

        newUser.PasswordSalt = passwordSalt;
        newUser.PasswordHash = passwordHash;

        await _usersCollection.InsertOneAsync(newUser);

        response.Data = _mapper.Map<GetUserDto>(newUser);

        return response;
    }

    public async Task<ServiceResponse<string>> Login(LoginDto user)
    {
        var response = new ServiceResponse<string>();

        var findUser = await _usersCollection
            .Find(u => u.Email == user.Email)
            .FirstOrDefaultAsync<User>();

        if (findUser is null)
        {
            response.Message = "Invalid credentials";
            response.Success = false;
        }
        else if (!ValidatePassword(user.Password, findUser.PasswordSalt!, findUser.PasswordHash!))
        {
            response.Message = "Invalid credentials";
            response.Success = false;
        }
        else
        {
            response.Data = GenerateJwtToken(findUser);
        }

        return response;
    }

    public async Task<ServiceResponse<GetUserDto>> GetMe()
    {
        var response = new ServiceResponse<GetUserDto>();

        var Id = _httpContextAccessor.HttpContext!.User.FindFirstValue(ClaimTypes.NameIdentifier);

        var user = await _usersCollection.Find(u => u.Id == Id).FirstOrDefaultAsync<User>();

        response.Data = _mapper.Map<GetUserDto>(user);

        return response;
    }

    private void HashPassword(string password, out byte[] passwordSalt, out byte[] passwordHash)
    {
        using (var hmac = new System.Security.Cryptography.HMACSHA512())
        {
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        }
    }

    private async Task<bool> UserExists(string email)
    {
        var user = await _usersCollection.Find(u => u.Email == email).FirstOrDefaultAsync<User>();
        if (user is null)
            return false;

        return true;
    }

    private bool ValidatePassword(string password, byte[] passwordSalt, byte[] passwordHash)
    {
        using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
        {
            var computeHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            return computeHash.SequenceEqual(passwordHash);
        }
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id!.ToString()),
            new Claim(ClaimTypes.Name, user.Email)
        };
        var appSettingToken = _configuration.GetSection("AppSettings:Token").Value;

        if (appSettingToken is null)
            throw new Exception("Appsetting Token is null");

        SymmetricSecurityKey key = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(appSettingToken)
        );

        SigningCredentials creds = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha512Signature
        );

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(30),
            SigningCredentials = creds
        };

        JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
        SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
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
