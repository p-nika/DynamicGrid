using System.Text.Json.Serialization;

namespace TestApplication.Models
{
    public class Column
    {
        public int Id { get; set; }
        public string? Name { get; set; }

        public int TableId { get; set; }

        [JsonIgnore]
        public Table Table { get; set; }
    }
}
