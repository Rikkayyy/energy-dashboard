using backend.Configuration;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Services.Configure<EiaSettings>(builder.Configuration.GetSection(EiaSettings.SectionName));

// Services
builder.Services.AddHttpClient<EiaService>();
builder.Services.AddMemoryCache();

// OpenAPI
builder.Services.AddOpenApi();
builder.Services.AddControllers();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Health check endpoint
app.MapGet("/health", () => Results.Ok( new
{
    status = "healthy",
    timestamp = DateTime.UtcNow,
    service = "Energy Dashboard API"
}));

app.MapControllers();

app.Run();