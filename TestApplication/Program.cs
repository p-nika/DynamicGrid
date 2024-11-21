using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using TestApplication;
using TestApplication.Controllers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.Converters.Add(new AddColumnRequestConverter());
    });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
string str = builder.Configuration.GetConnectionString("MysqlConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseMySql(str, ServerVersion.AutoDetect(str)));
builder.Services.AddSingleton<TypeMapper>();
builder.Services.AddScoped<TableController>();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseRouting();


app.UseCors("AllowAllOrigins");
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});
app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
