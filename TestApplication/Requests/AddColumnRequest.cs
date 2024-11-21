using TestApplication.Models;

namespace TestApplication.Requests
{
    public class AddColumnRequest
    {
        public string TableName { get; set; }

        public string ColumnName { get; set; }

        public ColumnType ColumnType { get; set; }

        public bool IsValidated { get; set; }
    }
}
