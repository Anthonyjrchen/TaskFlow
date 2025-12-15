namespace TaskFlow.Api.DTOs;
public class CreateTaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string Due_Date { get; set; } = string.Empty;
    }