using TestApplication.Models;

namespace TestApplication.Requests
{
    public class ChangeCellRequest
    {
        public int TableId { get; set; }
        public int ColInd { get; set; }
        public int RowInd { get; set; }
        public string Value { get; set; }
    }
}
