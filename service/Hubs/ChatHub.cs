using Microsoft.AspNetCore.SignalR;

namespace Chatty.Hubs
{
    public class ChatHub : Hub
    {
        public async Task JoinConnection(string uid)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, uid);
        }

        public async Task JoinConversation(string cid)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, cid);
        }

        public async Task LeaveConversation(string cid)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, cid);
        }

        public string GetConnectionId() => Context.ConnectionId;
    }
}
