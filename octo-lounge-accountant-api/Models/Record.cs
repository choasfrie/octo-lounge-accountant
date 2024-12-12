namespace octo_lounge_accountant_api.Models
{
    public class Record
    {
        public int Id { get; set; }
        public required decimal Amount { get; set; }
        public required DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public required int CreditorId { get; set; }
        public required int DebitorId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Account Creditor { get; set; }
        public Account Debitor { get; set; }
    }
}
