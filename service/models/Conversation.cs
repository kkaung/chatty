using System.Text.Json.Serialization;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Chatty.Models;

public class Conversation
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    public List<Message> Messages { get; set; } = new List<Message>();
    public string SenderOneId { get; set; } = String.Empty;
    public string SenderTwoId { get; set; } = String.Empty;
}
