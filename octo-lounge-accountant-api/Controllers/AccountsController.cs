using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using octo_lounge_accountant_api.ModelsDTO;
using octo_lounge_accountant_api.Models;
using octo_lounge_accountant_api.Data;
using octo_lounge_accountant_api.Handlers;

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
                AccountTypeId = accountDto.AccountType,
                OwnerId = accountDto.OwnerId
            };

            _context.Accounts.Add(account);
            _context.SaveChanges();

            return Ok(account);
        }
        [HttpDelete("deleteAccount/{id}")]
        public IActionResult DeleteAccount(int id)
        {
            var account = _context.Accounts.Find(id);
            if (account == null)
            {
                return NotFound("Account not found.");
            }

            _context.Accounts.Remove(account);
            _context.SaveChanges();

            return Ok("Account deleted successfully.");
        }
        [HttpPut("editAccount/{id}")]
        public IActionResult EditAccount(int id, [FromBody] AccountDTO accountDto)
        {
            if (accountDto == null)
            {
                return BadRequest("Account data is null.");
            }

            var account = _context.Accounts.Find(id);
            if (account == null)
            {
                return NotFound("Account not found.");
            }

            account.Name = accountDto.Name;
            account.AccountBehaviour = accountDto.Behaviour;
            account.AccountTypeId = accountDto.AccountType;
            account.OwnerId = accountDto.OwnerId;

            _context.Accounts.Update(account);
            _context.SaveChanges();

            return Ok(account);
        }
        [HttpGet("getAccountsByOwner/{ownerId}")]
        public IActionResult GetAccountsByOwner(int ownerId)
        {
            var accounts = _context.Accounts.Where(a => a.OwnerId == ownerId).ToList();
            if (accounts == null || !accounts.Any())
            {
                return NotFound("No accounts found for the specified owner.");
            }

            return Ok(accounts);
        }

        [HttpPost("createStandardPackage")]
        public IActionResult CreateStandardAccountPackage([FromBody] AccountPackDTO accountPackDto)
        {
            if (accountPackDto == null)
            {
                return BadRequest("Account package data is null.");
            }
            AccountPackageHandler handler = new AccountPackageHandler();
            List<Account> accounts;
            switch (accountPackDto.companyType)
            {
                case 'L':
                    accounts = handler.CreateStandardAccountPackageLimitedCompany(accountPackDto.profileId);
                    break;
                case 'G':
                    accounts = handler.CreateStandardAccountPackageForGmbH(accountPackDto.profileId);
                    break;
                case 'S':
                    accounts = handler.CreateStandardAccountPackageForSole(accountPackDto.profileId);
                    break;
                default:
                    return BadRequest("Invalid company type.");
            }

            _context.Accounts.AddRange(accounts);
            _context.SaveChanges();

            return Ok(accounts);
        }



    }
}
