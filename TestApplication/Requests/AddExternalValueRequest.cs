namespace TestApplication.Requests
{
    public class AddExternalValueRequest
    {
        public int TableId { get; set; }
        public int RowId { get; set; }
        public int ColInd { get; set; }
        public int ReferringRowId { get; set; }
    }
}
