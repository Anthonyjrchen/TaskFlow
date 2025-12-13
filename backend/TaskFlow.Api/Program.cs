var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddNewtonsoftJson();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
builder.Services.AddSingleton(provider =>
{
    var cfg = builder.Configuration.GetSection("Supabase");
    var url = cfg["Url"] ?? throw new InvalidOperationException("Supabase URL is missing");
    var key = cfg["AnonKey"] ?? throw new InvalidOperationException("Supabase AnonKey is missing");
    return new Supabase.Client(url, key);
});

// Simple JWT validation - just need the secret!
builder.Services.AddAuthentication("Bearer").AddJwtBearer(options =>
{
    var jwtSecret = builder.Configuration["Supabase:JwtSecret"];
    
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(jwtSecret)
        ),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true
    };
});

var app = builder.Build();

// Test Supabase connection on startup
using (var scope = app.Services.CreateScope())
{
    var supabase = scope.ServiceProvider.GetRequiredService<Supabase.Client>();
    try
    {
        await supabase.InitializeAsync();
        Console.WriteLine("✅ Supabase connection successful!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Supabase connection failed: {ex.Message}");
        throw;
    }
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();