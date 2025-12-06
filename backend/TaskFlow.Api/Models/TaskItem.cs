using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace TaskFlow.Api.Models;

[Table("tasks")]
public class TaskItem: BaseModel
{
    public long id { get; set; }
    public Guid user_id { get; set; }
    public string title { get; set; } = string.Empty;
    public bool is_done { get; set; }
}