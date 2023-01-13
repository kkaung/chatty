using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Chatty.Models;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public string Text { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string SenderId { get; set; } = String.Empty;
}
