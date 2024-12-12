using octo_lounge_accountant_api.Models;

namespace octo_lounge_accountant_api.ModelsDTO
{
    public class RecordInAccountDTO
    {
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public char AccountBehaviour { get; set; }
        public int? AccountTypeId { get; set; }
        public int AccountNumber { get; set; }
        public int OwnerId { get; set; }
        public List<RecordDTO> Records { get; set; }
    }
}
