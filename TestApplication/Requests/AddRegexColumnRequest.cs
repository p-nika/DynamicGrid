using System.Text.RegularExpressions;

namespace TestApplication.Requests
{
    public class AddRegexColumnRequest : AddColumnRequest
    {
        public string Regex { get; set; }
    }
}
