namespace TestApplication.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public List<int> AccessToTables { get; set; } = new List<int>();
        public bool IsAdmin { get; set; }
    }
}
