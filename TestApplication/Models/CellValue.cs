

using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace TestApplication.Models
{
    public class CellValue
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public int RowId { get; set; }

        public int ColInd { get; set; }
        [System.Text.Json.Serialization.JsonIgnore] public Row? Row { get; set; }

        public void SetValue<T> (T value)
        {
            Value = JsonConvert.SerializeObject(value);
        }

        public T GetValue<T>()
        {
            return JsonConvert.DeserializeObject<T>(Value);
        }
    }
}
