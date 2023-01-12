using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI.GPT3.Managers;
using OpenAI.GPT3;
using OpenAI.GPT3.ObjectModels.RequestModels;

namespace Chatty.Controllers;

[Authorize]
[ApiController]
[Route("api/reply")]
public class ReplyController : ControllerBase
{
    private IConfiguration _configuration;

    public ReplyController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    [HttpPost]
    public async Task<ActionResult<ServiceResponse<string>>> RequestReply(RequestReplyDto request)
    {
        var response = new ServiceResponse<string>();

        var openAiService = new OpenAIService(
            new OpenAiOptions()
            {
                ApiKey = _configuration.GetSection("OpenAIServiceOptions:ApiKey").Value!
            }
        );

        var completionResult = await openAiService.Completions.CreateCompletion(
            new CompletionCreateRequest()
            {
                Prompt = "Generate sweet reply based on this " + request.Text,
                MaxTokens = 20
            },
            OpenAI.GPT3.ObjectModels.Models.TextDavinciV3
        );

        response.Data = completionResult.Choices.FirstOrDefault()!.Text;

        return Ok(response);
    }
}
