namespace octo_lounge_accountant_api.ModelsDTO
{
    public class RecordDTO
    {
        public required DateTime Date { get; set; }
        public required decimal Amount { get; set; }
        public string Description { get; set; }
        public required int DebitorId { get; set; }
        public required int CreditorId { get; set; }
    }
}
