using Microsoft.EntityFrameworkCore.Update.Internal;

namespace TestApplication.Models
{
    public class Table
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public List<Column> Columns { get; set; } = new List<Column>();

        public List<Row> Rows { get; set; } = new List<Row>();
        
        public void AddColumn(Column column)
        {
            Columns.Add(column);
        }

        public void AddRow(Row row) 
        {
            Rows.Add(row); 
        }
    }
}
