namespace Chatty.Services;

public interface IAuthService
{
    Task<ServiceResponse<GetUserDto>> Register(RegisterDto user);
    Task<ServiceResponse<string>> Login(LoginDto user);
    Task<ServiceResponse<GetUserDto>> GetMe();
}
