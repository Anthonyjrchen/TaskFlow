using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TaskFlow.Api.Models;

[Table("tasks")]
public class TaskItem
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [Column("user_id")]
    public string UserId { get; set; } = string.Empty;

    [Required]
    [Column("title")]
    public string Title { get; set; } = string.Empty;

    [Column("is_done")]
    public bool IsDone { get; set; } = false;

    [Column("due_date")]
    public DateOnly DueDate { get; set; }
}