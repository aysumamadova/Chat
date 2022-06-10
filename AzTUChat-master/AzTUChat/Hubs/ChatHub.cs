using AzTUChat.DAL;
using AzTUChat.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AzTUChat.Hubs
{
    public class ChatHub:Hub
    {
        private readonly AppDbContext _context;

        public ChatHub(AppDbContext context)
        {
            _context = context;
        }
        public async Task SendMessage(string userName, string message)
        {
            AppUser user = _context.Users.SingleOrDefault(u => u.UserName == userName);
            await Clients.Client(user.ConnectionId).SendAsync("ReceiveMessage", message);
        }
        public override Task OnConnectedAsync()
        {
            AppUser user = _context.Users.SingleOrDefault(u => u.UserName == Context.User.Identity.Name);
            user.ConnectionId = Context.ConnectionId;
            Clients.All.SendAsync("Connected", Context.User.Identity.Name);
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception exception)
        {
            AppUser user = _context.Users.SingleOrDefault(u => u.UserName == Context.User.Identity.Name);
            user.ConnectionId = null;
            Clients.All.SendAsync("DisConnected", Context.User.Identity.Name);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
