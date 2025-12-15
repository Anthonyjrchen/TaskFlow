namespace TaskFlow.Api.DTOs;

public class UpdateTaskDto
{
    public string? Title { get; set; }
    public bool? IsDone { get; set; }
    public string? Due_Date { get; set; }
}