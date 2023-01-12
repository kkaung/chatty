namespace Chatty.Services;

public interface IUserService
{
    Task<ServiceResponse<List<GetUserDto>>> GetUsers(string q);
    Task<ServiceResponse<GetUserDto>> AddFriend(string id);
    Task<ServiceResponse<GetUserDto>> RemoveFriend(string id);
    Task<ServiceResponse<GetUserDto>> UpdateUser(UpdateUserDto update);
    Task<ServiceResponse<GetUserDto>> GetUserById(string id);
}
