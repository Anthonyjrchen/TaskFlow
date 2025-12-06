using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    public class TaskController: ControllerBase
    {
        // Initialize connection to supabase client
        private readonly Supabase.Client _supabase;
        public TaskController(Supabase.Client supabase)
        {
            _supabase = supabase;
        }

        // Get all tasks for a user
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var response = await _supabase.From<TaskItem>().Get();
            return Ok(response.Models);
        }
    }
}