using Microsoft.AspNetCore.SignalR;

namespace Chatty.Hubs
{
    public class ChatHub : Hub
    {
        public Task JoinConversation(string cid)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, cid);
        }

        public Task LeaveConversation(string cid)
        {
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, cid);
        }
    }
}
