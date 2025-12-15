namespace TaskFlow.Api.Auth;

public class JwtSettings
{
    public string SecretKey { get; set; } = string.Empty;
    public int ExpirationMinutes { get; set; } = 60;  // 1 hour default
}