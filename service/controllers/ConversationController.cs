using Chatty.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chatty.Controllers;

[Authorize]
[ApiController]
[Route("api/conversations")]
public class ConversationsController : ControllerBase
{
    private IConversationService _service;

    public ConversationsController(IConversationService conversationService)
    {
        _service = conversationService;
    }

    [HttpGet]
    public async Task<
        ActionResult<ServiceResponse<List<GetConversationDto>>>
    > GetUserConversations()
    {
        var response = await _service.GetUserConversations();

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<GetConversationDto>>> CreateUserConversation(
        CreateConversationDto createConversation
    )
    {
        var response = await _service.CreateUserConversation(createConversation);

        return Ok(response);
    }

    [HttpPost("{cid}/messages")]
    public async Task<ActionResult<GetConversationDto>> CreateMessage(
        string cid,
        CreateMessageDto createMessage,
        [FromServices] IHubContext<ChatHub> chatHubContext
    )
    {
        var response = await _service.CreateMessage(cid, createMessage);


        if (!response.Success)
            return BadRequest(response);

        Console.WriteLine("Reach");
        await chatHubContext.Clients.Group(cid).SendAsync("ReceiveMessage", response.Data);

        return Ok();
    }
}
