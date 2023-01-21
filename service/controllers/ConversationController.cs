using Chatty.Hubs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chatty.Controllers;

[EnableCors("AllowSpecificOrigin")]
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
    public async Task<ActionResult<ServiceResponse<List<GetConversationDto>>>> GetUserConversations(
        [FromServices] IHubContext<ChatHub> chatHubContext
    )
    {
        var response = await _service.GetUserConversations();

        if (!response.Success)
            return BadRequest(response);

        return Ok(response);
    }

    [HttpPost]
    public async Task<
        ActionResult<ServiceResponse<List<GetConversationDto>>>
    > CreateUserConversation(
        CreateConversationDto createConversation,
        [FromServices] IHubContext<ChatHub> chatHubContext
    )
    {
        var response = await _service.CreateUserConversation(createConversation);

        if (!response.Success)
            return BadRequest(response);

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

        var isNewMessage = response.Data!.Messages.Count == 1;

        if (isNewMessage is true)
        {
            await chatHubContext.Clients
                .Groups(response.Data.SenderOne!.Id!)
                .SendAsync("NewMessage", response.Data);
            await chatHubContext.Clients
                .Groups(response.Data.SenderTwo!.Id!)
                .SendAsync("NewMessage", response.Data);

            return Ok();
        }

        await chatHubContext.Clients.Group(cid).SendAsync("ReceiveMessage", response.Data);

        return Ok();
    }
}
