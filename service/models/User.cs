using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Chatty.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Username { get; set; } = String.Empty;
    public string ImageURL { get; set; } = String.Empty;
    public string Email { get; set; } = String.Empty;
    public List<string> FriendIds { get; set; } = new List<string>();
    public byte[]? PasswordSalt { get; set; }
    public byte[]? PasswordHash { get; set; }
}
