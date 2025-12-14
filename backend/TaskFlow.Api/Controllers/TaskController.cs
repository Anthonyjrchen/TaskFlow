using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.Models;

namespace TaskFlow.Api.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TaskController: ControllerBase
    {
        private readonly Supabase.Client _supabase;
        public TaskController(Supabase.Client supabase)
        {
            _supabase = supabase;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var userId = GetUserId();
            var response = await _supabase.From<TaskItem>().Where(x => x.user_id == userId).Get();
            return Ok(response.Models);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            var userID = GetUserId();
            var task = new TaskItem
            {
                user_id = userID,
                title = dto.Title,
                is_done = false,
                due_date = DateOnly.Parse(dto.Due_Date)
            };
            var response = await _supabase.From<TaskItem>().Insert(task);
            return CreatedAtAction(nameof(GetAllTasks), new { id = response.Models.First().id}, response.Models.First());
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(long id, [FromBody] UpdateTaskDto dto)
        {
            var userId = GetUserId();
            var existingTask = await _supabase
                .From<TaskItem>()
                .Where(t => t.id == id && t.user_id == userId)
                .Single();
            
            if (existingTask == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            if (dto.Title != null) existingTask.title = dto.Title;
            if (dto.IsDone.HasValue) existingTask.is_done = dto.IsDone.Value;
            if (dto.Due_Date != null) existingTask.due_date = DateOnly.Parse(dto.Due_Date);

            await existingTask.Update<TaskItem>();

            return Ok(existingTask);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(long id)
        {
            var userId = GetUserId();
            await _supabase.From<TaskItem>().Where(x => x.id == id && x.user_id == userId).Delete();
            return NoContent();
        }

        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier")?.Value;
            
            if (string.IsNullOrEmpty(userIdClaim))
            {
                userIdClaim = User.FindFirst("sub")?.Value;
            }
            
            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            
            return Guid.Parse(userIdClaim);
        }
    }
    
    public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Due_Date { get; set; } = string.Empty;
    }

    public class UpdateTaskDto
    {
        public string? Title { get; set; }
        public bool? IsDone { get; set; }
        public string? Due_Date { get; set; }
    }
}