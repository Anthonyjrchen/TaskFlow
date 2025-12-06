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

        // Create a task
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskItem task)
        {
            var response = await _supabase.From<TaskItem>().Insert(task);
            return CreatedAtAction(nameof(GetAllTasks), new { id = response.Models.First().id}, response.Models.First());
        }

        // Update a task
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(long id, [FromBody] TaskItem task)
        {
            task.id = id;
            await _supabase.From<TaskItem>().Update(task);
            return NoContent();
        }

        // Delete a task
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(long id)
        {
            await _supabase.From<TaskItem>().Where(x => x.id == id).Delete();
            return NoContent();
        }
    }
}