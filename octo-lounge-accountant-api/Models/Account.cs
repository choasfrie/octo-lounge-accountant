namespace octo_lounge_accountant_api.Models
{
    public class Account
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required char AccountBehaviour { get; set; }
        public int AccountTypeId { get; set; } 
        public int AccountNumber { get; set; }
        public required int OwnerId { get; set; }

        public Profile Owner { get; set; }
        public AccountType AccountType { get; set; }
    }
}
