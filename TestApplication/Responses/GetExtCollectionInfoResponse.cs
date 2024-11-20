using TestApplication.Models;

namespace TestApplication.Responses
{
    public class GetExtCollectionInfoResponse
    {
        public int TableId { get; set; }
        public int RowInd { get; set; }
        public ExternalCollection ColumnInfo { get; set; }
    }
}
