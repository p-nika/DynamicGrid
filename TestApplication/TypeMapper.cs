using System.Text.RegularExpressions;
using Newtonsoft.Json.Linq;
using TestApplication.Models;

namespace TestApplication
{
    public class TypeMapper
    {

        public bool Validate(ColumnType type, string value, out string message)
        {
            message = "";
            switch (type)
            {
                case ColumnType.Text:
                    return true;
                case ColumnType.Numeric:
                    if(Int32.TryParse(value, out _))
                    {
                        return true;
                    }
                    else
                    {
                        message = $"{value} is not an integer";
                        return false;
                    }
                case ColumnType.Email:
                    int indAt = value.IndexOf('@');
                    if ( indAt == -1)
                    {
                        message = "should contain @";
                        return false;
                    }
                    int indDot = value.LastIndexOf('.');
                    if(indDot <= indAt)
                    {
                        message = "should contain . after @";
                        return false;
                    }
                    return true;
                case ColumnType.Regex:
                    try
                    {
                        _ = new Regex(value);
                    }
                    catch (Exception ex)
                    {
                        return false;
                    }
                    return true;
                default:
                    return false;
            }
        }

        internal void SetValue(ColumnType columnType, string value, CellValue cellValue)
        {
            switch (columnType)
            {
                case ColumnType.Text:
                    cellValue.SetValue<string>(value);
                    break;
                case ColumnType.Numeric:
                    Int32.TryParse(value, out int intValue);
                    cellValue.SetValue<NumericValue>(new NumericValue() { Number = intValue});
                    break;
                case ColumnType.Email:
                    cellValue.SetValue<EmailValue>(new EmailValue() { Email = value });
                    break;
                case ColumnType.Regex:
                    cellValue.SetValue<Regex>(new Regex(value));
                    break;
            }
        }
    }
}
