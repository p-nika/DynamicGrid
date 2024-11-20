namespace TestApplication.Requests
{
    public class RemoveColumnRequest
    {
        public int TableId { get; set; }
        public List<int> ColumnInds { get; set; }
    }
}
