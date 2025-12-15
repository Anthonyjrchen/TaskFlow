using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TaskFlow.Api.Data;
using TaskFlow.Api.Models;
using Microsoft.EntityFrameworkCore;
using TaskFlow.Api.DTOs;
using System.Security.Claims;
namespace TaskFlow.Api.Controllers
{
    [ApiController]
    [Route("api/tasks")]
    [Authorize]
    public class TaskController: ControllerBase
    {
        private readonly AppDbContext _db;
        public TaskController(AppDbContext db)
        {
            _db = db;
        }
        
        private Guid GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier) 
                        ?? User.FindFirst("sub");
            
            if (userIdClaim == null)
                throw new UnauthorizedAccessException("User ID not found in token");
            
            return Guid.Parse(userIdClaim.Value);
        }
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var userId = GetUserId();
            var tasks = await _db.Tasks
                .Where(t => t.UserId == userId)
                .ToListAsync();
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTaskDto dto)
        {
            var userId = GetUserId();
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
            var userId = GetUserId();
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
            var userId = GetUserId();
            var existingTask = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);
            if (existingTask == null) {
                return NotFound("Task not found or you do not have permission.");
            }
            _db.Tasks.Remove(existingTask);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}