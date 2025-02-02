using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Configurar o logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Adicionar serviços ao contêiner
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("DatabaseName"));

// Adicionar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

builder.Services.AddControllers();

// Configuração do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure o pipeline de requisições HTTP
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");
app.MapControllers(); // Mapeia os controllers automaticamente

app.Run();
