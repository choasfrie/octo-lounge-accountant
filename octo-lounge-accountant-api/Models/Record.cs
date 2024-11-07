namespace octo_lounge_accountant_api.Models
{
    public class Records
    {
        public int Id { get; set; }
        public required decimal Amount { get; set; }
        public required string Description { get; set; }
        public required int CreditorId { get; set; }
        public required int DebtorId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Account Creditor { get; set; }
        public Account Debtor { get; set; }
    }
}
