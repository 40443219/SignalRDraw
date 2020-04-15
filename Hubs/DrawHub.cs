using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

using SignalRDraw.Models;
using SignalRDraw.Services;

namespace SignalRDraw.Hubs
{
    public class DrawHub : Hub
    {
        private readonly IDrawService _drawService;

        public DrawHub(IDrawService drawService)
        {
            _drawService = drawService;
        }

        public async Task SendDraw(RecModel model) {
            if(model.type == "clearBoard")
            {
                await _drawService.ClearModels();
            } 
            else
            {
                await _drawService.AddToModels(model);
            }
            await Clients.AllExcept(Context.ConnectionId).SendAsync("ReceiveDraw", model);
        }

        public async Task GetModels() {
            await Clients.Caller.SendAsync("InitialDraw", await _drawService.GetRecModels());
        }
    }
}