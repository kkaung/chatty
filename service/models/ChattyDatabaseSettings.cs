namespace Chatty.Models;

public class ChattyDatabaseSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string UsersCollectionName { get; set; } = null!;
    public string ConversationsCollectionName { get; set; } = null!;
    public string MessagesCollectionName { get; set; } = null!;
}
