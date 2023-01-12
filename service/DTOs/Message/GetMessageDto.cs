using Chatty.Models;

namespace Chatty.DTOs;

public class GetMessageDto
{
    public string? Id { get; set; }
    public string Text { get; set; } = String.Empty;
    public string SenderId { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; }
}
