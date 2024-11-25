namespace TestApplication.Requests
{
    public class AddExternalCollectionColumnRequest : AddColumnRequest
    {
        public string ReferringToTableName { get; set; }
        public string ReferringToColumnName { get; set; }
    }
}
