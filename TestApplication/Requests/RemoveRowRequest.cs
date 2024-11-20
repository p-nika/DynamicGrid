namespace TestApplication.Requests
{
    public class RemoveRowsRequest
    {
        public int TableId { get; set; }
        public List<int> RowInds { get; set; }
    }
}
