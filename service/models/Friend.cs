using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Chatty.Models;

public class Friend
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Username { get; set; } = String.Empty;
    public string Email { get; set; } = String.Empty;
    public string ImageURL { get; set; } = String.Empty;
}
