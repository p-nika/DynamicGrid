namespace TestApplication.Models
{
    public class ExternalCollection : ColumnInfo
    {
        public int ReferringToTableId { get; set; }
        public int ReferringToColumnId { get; set; }
    }
}
