using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.Data;
using TaskFlow.Api.Models;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.DTOs;
namespace TaskFlow.Api.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    // [Authorize]
    public class TaskController: ControllerBase
    {
        private readonly AppDbContext _db;
        public TaskController(AppDbContext db)
        {
            _db = db;
        }
        
        private Guid GetTestUserId()
        {
            // This is a hardcoded test GUID - we'll replace this with real JWT extraction later
            return Guid.Parse("00000000-0000-0000-0000-000000000001");
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var userId = GetTestUserId();
            var tasks = await _db.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            var userId = GetTestUserId();
            var task = new TaskItem
            {
                UserId = userId,
                Title = dto.Title,
                IsDone = false,
                DueDate = DateOnly.Parse(dto.Due_Date)
            };
            _db.Tasks.Add(task);
            await _db.SaveChangesAsync();
            return Ok(task);

        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateTask(long id, [FromBody] UpdateTaskDto dto)
        {
            var userId = GetTestUserId();
            var existingTask = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (existingTask == null)
            {
                return NotFound("Task not found or you do not have permission.");
            }

            if (dto.Title != null) existingTask.Title = dto.Title;
            if (dto.IsDone.HasValue) existingTask.IsDone = dto.IsDone.Value;
            if (dto.Due_Date != null) existingTask.DueDate = DateOnly.Parse(dto.Due_Date);

            await _db.SaveChangesAsync();

            return Ok(existingTask);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(long id)
        {
            var userId = GetTestUserId();
            var existingTask = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (existingTask == null) {
                return NotFound("Task not found or you do not have permission.");
            }
            _db.Tasks.Remove(existingTask);
            await _db.SaveChangesAsync();
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
}