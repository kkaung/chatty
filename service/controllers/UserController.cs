using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chatty.Controllers;

[Authorize]
[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private IUserService _service;

    public UserController(IUserService userService)
    {
        _service = userService;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<ServiceResponse<List<GetUserDto>>>> GetUsers(
        [FromQuery] string q = ""
    )
    {
        var response = await _service.GetUsers(q);

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceResponse<GetUserDto>>> GetUser(string id)
    {
        var response = await _service.GetUserById(id);

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult<ServiceResponse<UpdateUserDto>>> UpdateUser(
        [FromBody] UpdateUserDto update
    )
    {
        var response = await _service.UpdateUser(update);

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpGet("add-friend/{id}")]
    public async Task<ActionResult<ServiceResponse<GetUserDto>>> AddFriend(string id)
    {
        var response = await _service.AddFriend(id);

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpGet("unfriend/{id}")]
    public async Task<ActionResult<ServiceResponse<GetUserDto>>> RemoveFriend(string id)
    {
        var response = await _service.RemoveFriend(id);

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }
}
