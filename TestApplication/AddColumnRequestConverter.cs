using System.Text.Json;
using System.Text.Json.Serialization;
using TestApplication.Requests;

namespace TestApplication
{
    public class AddColumnRequestConverter : JsonConverter<AddColumnRequest>
    {
        public override AddColumnRequest Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            using (var document = JsonDocument.ParseValue(ref reader))
            {
                var type = document.RootElement.GetProperty("columnType").GetInt32();

                return type switch
                {
                    1 => JsonSerializer.Deserialize<AddExternalCollectionColumnRequest>(document.RootElement.GetRawText(), options),
                    _ => JsonSerializer.Deserialize<AddColumnRequest>(document.RootElement.GetRawText(), WithoutThisConverter(options))
                };
            }
        }

        public override void Write(Utf8JsonWriter writer, AddColumnRequest value, JsonSerializerOptions options)
        {
            JsonSerializer.Serialize(writer, value, options);
        }

        private JsonSerializerOptions WithoutThisConverter(JsonSerializerOptions options)
        {
            var newOptions = new JsonSerializerOptions(options);

            // Remove the current converter
            newOptions.Converters.Remove(newOptions.Converters.First(c => c is AddColumnRequestConverter));

            return newOptions;
        }
    }
}
