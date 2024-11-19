using System.Text.Json.Serialization;

namespace TestApplication.Models
{
    public class Row
    {
        public int Id { get; set; }
        public List<CellValue> Values { get; set; } = new List<CellValue>();
        public int TableId { get; set; }
        public int RowInd { get; set; }

        [JsonIgnore]
        public Table Table { get; set; }
    }
}