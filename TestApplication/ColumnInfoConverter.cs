namespace TestApplication
{
    using System.Text.Json;
    using System.Text.Json.Serialization;
    using TestApplication.Models;

    public class ColumnInfoConverter : JsonConverter<ColumnInfo>
    {
        public override ColumnInfo Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            throw new NotImplementedException(); // Implement if needed
        }

        public override void Write(Utf8JsonWriter writer, ColumnInfo value, JsonSerializerOptions options)
        {
            if (value == null)
            {
                writer.WriteNullValue();
                return;
            }

            // Remove this converter temporarily to avoid recursion
            var optionsWithoutConverter = new JsonSerializerOptions(options);
            var converterToRemove = optionsWithoutConverter.Converters.FirstOrDefault(c => c is ColumnInfoConverter);
            if (converterToRemove != null)
            {
                optionsWithoutConverter.Converters.Remove(converterToRemove);
            }

            // Handle serialization based on the type of ColumnInfo
            if (value is ExternalCollection externalCollection)
            {
                JsonSerializer.Serialize(writer, externalCollection, optionsWithoutConverter);
            }
            else
            {
                JsonSerializer.Serialize(writer, value, optionsWithoutConverter);
            }
        }
    }
}
