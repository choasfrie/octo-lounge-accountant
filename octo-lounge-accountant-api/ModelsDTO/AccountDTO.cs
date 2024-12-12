namespace octo_lounge_accountant_api.ModelsDTO
{
    public class AccountDTO
    {
        public required string Name { get; set; }
        public int? AccountType { get; set; }
        public int AccountNumber { get; set; }
        public required char Behaviour { get; set; }
        public required int OwnerId { get; set; }
    }
}
