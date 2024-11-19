namespace TestApplication.Requests
{
    public class AddRowRequest
    {
        public int TableId { get; set; }
        public List<object> Values { get; set; }

    }
}
