namespace octo_lounge_accountant_api.ModelsDTO
{
    public class RecordDTO
    {
        public DateTime Date { get; set; }
        public required decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public required int CreditorId { get; set; }
        public required int DebitorId { get; set; }
    }
}
