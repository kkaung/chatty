namespace Chatty.Services;

public interface IConversationService
{
    Task<ServiceResponse<List<GetConversationDto>>> GetUserConversations();
    Task<ServiceResponse<List<GetConversationDto>>> CreateUserConversation(
        CreateConversationDto createConversation
    );
    Task<ServiceResponse<GetConversationDto>> CreateMessage(
        string cid,
        CreateMessageDto createMessage
    );
}
