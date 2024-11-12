using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using octo_lounge_accountant_api.ModelsDTO;
using octo_lounge_accountant_api.Models;

namespace octo_lounge_accountant_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
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
                Type = accountDto.Type,
                OwnerId = accountDto.OwnerId
            };


            return Ok();
        }
    }
}
