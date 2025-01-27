using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using octo_lounge_accountant_api.ModelsDTO;
using octo_lounge_accountant_api.Models;
using octo_lounge_accountant_api.Data;
using octo_lounge_accountant_api.Handlers;
using System.Collections.Generic;

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

        [HttpGet("getAllAccountsAndRecords/{ownerId}")]
        public IActionResult GetAllAccountsAndStatements(int ownerId)
        {
            var accounts = _context.Accounts.Where(a => a.OwnerId == ownerId).ToList();

            if (accounts == null || !accounts.Any())
            {
                return NotFound("No accounts found for the specified owner.");
            }

            var accountWithRecordsList = new List<RecordInAccountDTO>();

            foreach (var account in accounts)
            {
                var records = _context.Records
                    .Where(r => r.CreditorId == account.Id || r.DebitorId == account.Id)
                    .Select(r => new RecordDTO
                    {
                        Id = r.Id,
                        Date = r.Date,
                        Amount = r.Amount,
                        Description = r.Description,
                        CreditorId = r.CreditorId,
                        DebitorId = r.DebitorId
                    })
                    .ToList();

                var accountWithRecords = new RecordInAccountDTO
                {
                    AccountId = account.Id,
                    AccountName = account.Name,
                    AccountBehaviour = account.AccountBehaviour,
                    AccountTypeId = account.AccountTypeId,
                    AccountNumber = account.AccountNumber,
                    OwnerId = account.OwnerId,
                    Records = records
                };

                accountWithRecordsList.Add(accountWithRecords);
            }

            return Ok(accountWithRecordsList);
        }

        [HttpPost("createStandardPackage")]
        public async Task<IActionResult> CreateStandardAccountPackage([FromBody] AccountPackDTO accountPackDto)
        {
            Console.WriteLine($"Received request to create standard package. ProfileId: {accountPackDto?.profileId}, CompanyType: {accountPackDto?.companyType}");
            
            if (accountPackDto == null)
            {
                return BadRequest("Account package data is null.");
            }

            // Verify that the Profile exists
            var profile = await _context.Profiles.FindAsync(accountPackDto.profileId);
            if (profile == null)
            {
                return BadRequest($"Profile with ID {accountPackDto.profileId} does not exist.");
            }
            AccountPackageHandler handler = new AccountPackageHandler();
            List<Account> accounts;
            Console.WriteLine($"Creating account package for company type: {accountPackDto.companyType}");
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
                    return BadRequest("Invalid company type. Must be L (LLC), G (PLC), or S (Sole Proprietorship).");
            }

            // Validate AccountTypeId
            /*foreach (var account in accounts)
            {
                if (!_context.AccountTypes.Any(at => at.Id == account.AccountTypeId))
                {
                    return BadRequest($"Invalid AccountTypeId: {account.AccountTypeId}");
                }
            }*/

            Console.WriteLine($"Created {accounts.Count} accounts for the package");
            
            _context.Accounts.AddRange(accounts);
            _context.SaveChanges();

            Console.WriteLine("Successfully saved accounts to database");
            return Ok(accounts);
        }

    }
}
