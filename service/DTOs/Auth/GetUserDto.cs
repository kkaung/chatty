using Chatty.Models;

namespace Chatty.DTOs;

public class GetUserDto
{
    public string Id { get; set; } = String.Empty;
    public string Username { get; set; } = String.Empty;
    public string Email { get; set; } = String.Empty;
    public string ImageURL { get; set; } = String.Empty;
    public List<Friend> Friends { get; set; } = new List<Friend>();
}
