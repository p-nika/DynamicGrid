using System.Text.Json.Serialization;

namespace TestApplication.Models
{
    public class ColumnInfo
    {
        public int Id { get; set; }
        public int TableId { get; set; }
        public int ColumnId { get; set; }
        public ColumnType ColumnType { get; set; }

        [JsonIgnore]
        public Column Column { get; set; }
    }
}
