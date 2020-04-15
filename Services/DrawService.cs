using System.Collections.Generic;
using System.Threading.Tasks;

using SignalRDraw.Models;

namespace SignalRDraw.Services
{
    public class DrawService : IDrawService
    {
        private readonly List<RecModel> recModels;

        public DrawService()
        {
            recModels = new List<RecModel>();
        }

        public async Task<List<RecModel>> GetRecModels()
        {
            return await Task.Run(() => recModels);
        }

        public async Task AddToModels(RecModel model)
        {
            await Task.Run(() => recModels.Add(model));
        }

        public async Task ClearModels()
        {
            await Task.Run(() => recModels.Clear());
        }
    }
}