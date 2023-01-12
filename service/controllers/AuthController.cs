using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chatty.Controllers;

[Authorize]
[ApiController]
[Route("public")]
public class AuthController : ControllerBase
{
    private IAuthService _service;

    public AuthController(IAuthService authService)
    {
        _service = authService;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<ActionResult<ServiceResponse<GetUserDto>>> Register(RegisterDto user)
    {
        var response = await _service.Register(user);

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<ServiceResponse<string>>> Login(LoginDto user)
    {
        var response = await _service.Login(user);

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpGet("me")]
    public async Task<ActionResult<ServiceResponse<GetUserDto>>> GetMe()
    {
        var response = await _service.GetMe();

        return Ok(response);
    }
}
