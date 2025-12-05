var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton(provider =>
{
    var cfg = builder.Configuration.GetSection("Supabase");
    var url = cfg["Url"] ?? throw new InvalidOperationException("Supabase URL is missing");
    var key = cfg["AnonKey"] ?? throw new InvalidOperationException("Supabase AnonKey is missing");
    return new Supabase.Client(url, key);
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
        throw; // Stop the app if DB connection fails
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
