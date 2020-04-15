using System.Collections.Generic;
using System.Threading.Tasks;

using SignalRDraw.Models;

namespace SignalRDraw.Services
{
    public interface IDrawService
    {
        Task AddToModels(RecModel model);

        Task<List<RecModel>> GetRecModels();

        Task ClearModels();
    }
}