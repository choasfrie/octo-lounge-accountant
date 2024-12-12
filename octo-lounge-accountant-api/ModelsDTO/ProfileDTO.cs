namespace octo_lounge_accountant_api.ModelsDTO
{
    public class ProfileDTO
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string PasswordHash { get; set; }
    }
}
