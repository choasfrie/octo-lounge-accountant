using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using octo_lounge_accountant_api.ModelsDTO;
using octo_lounge_accountant_api.Models;
using octo_lounge_accountant_api.Data;

namespace octo_lounge_accountant_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {

        private readonly DataContext _context;

        public AccountsController(DataContext context)
        {
            _context = context;
        }


        [HttpPost("createAccount")]
        public IActionResult CreateAccount([FromBody] AccountDTO accountDto)
        {
            if (accountDto == null)
            {
                return BadRequest("Account data is null.");
            }
            Account account = new Account
            {
                Name = accountDto.Name,
                AccountBehaviour = accountDto.Behaviour,
                AccountTypeId = accountDto.Type,
                OwnerId = accountDto.OwnerId
            };

            _context.Accounts.Add(account);
            _context.SaveChanges();

            return Ok();
        }
    }
}
