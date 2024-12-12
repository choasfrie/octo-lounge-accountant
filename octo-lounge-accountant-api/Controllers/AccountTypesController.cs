using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using octo_lounge_accountant_api.Data;
using octo_lounge_accountant_api.Models;

namespace octo_lounge_accountant_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountTypesController : ControllerBase
    {
        private readonly DataContext _context;

        public AccountTypesController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("createAccountType")]
        public IActionResult CreateAccountType([FromBody] AccountType accountTypeDto)
        {
            if (accountTypeDto == null)
            {
                return BadRequest("Account type data is null.");
            }
            AccountType accountType = new AccountType
            {
                Name = accountTypeDto.Name,
            };

            _context.AccountTypes.Add(accountType);
            _context.SaveChanges();

            return Ok(accountType);
        }
        
    }
}
