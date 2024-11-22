namespace TestApplication.Requests
{
    public class DeleteExtCollectionValueRequest
    {
        public int TableId { get; set; }
        public int RowId { get; set; }
        public int ColInd { get; set; }
        public int ToRemoveReferenceRowId { get; set; }

    }
}
