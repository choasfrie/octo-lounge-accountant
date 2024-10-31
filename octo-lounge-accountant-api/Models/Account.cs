namespace octo_lounge_accountant_api.Models
{
    public class Account
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required int Type { get; set; }
        public required int OwnerId { get; set; }
    }
}
