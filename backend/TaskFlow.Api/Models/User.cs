using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace TaskFlow.Api.Models;

[Table("users")]
[Index(nameof(Email), IsUnique = true)]
public class User
{
    // TODO: Add a primary key property (Id)
    // Hint: What type did you use for TaskItem.Id?
    [Key]
    [Column("id")]
    public Guid Id { get; set; }
    
    // TODO: Add Email property
    // Hint: Should be Required and unique
    [Required]
    [Column("email")]
    public string Email { get; set; } = string.Empty;
    
    // TODO: Add PasswordHash property
    // Hint: This stores the hashed password, not the plain password
    [Required]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    // TODO: Add a navigation property for tasks
    // Hint: One user can have many tasks - what type should this be?
    public List<TaskItem> Tasks { get; set; } = new();
} 