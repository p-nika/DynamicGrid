namespace TestApplication.Models
{
    public class UserPermissionsTableEntry
    {
        public int UserId { get; set; }
        public int AccessToTable { get; set; }

        public string UserEmail { get; set; }
    }
}
