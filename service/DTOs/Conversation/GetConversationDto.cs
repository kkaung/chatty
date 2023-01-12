using Chatty.Models;

namespace Chatty.DTOs;

public class GetConversationDto
{
    public string? Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<Message> Messages { get; set; } = new List<Message>();
    public Friend? SenderOne { get; set; }
    public Friend? SenderTwo { get; set; }
}
