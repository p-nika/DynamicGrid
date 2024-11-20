namespace TestApplication.Requests
{
    public class AddExternalCollectionColumnRequest : AddColumnRequest
    {
        public int ReferringToTableId { get; set; }
        public int ReferringToColumnId { get; set; }
    }
}
