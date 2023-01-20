
namespace Chatty.Models;

public class Message
{
    public string Text { get; set; } = String.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public string SenderId { get; set; } = String.Empty;
}
