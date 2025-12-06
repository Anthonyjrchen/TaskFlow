using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace TaskFlow.Api.Models;

[Table("tasks")]
public class TaskItem : BaseModel
{
    [PrimaryKey("id", false)]
    public long id { get; set; }
    
    [Column("user_id")]
    public Guid user_id { get; set; }
    
    [Column("title")]
    public string title { get; set; } = string.Empty;
    
    [Column("is_done")]
    public bool is_done { get; set; }
}