using Microsoft.AspNetCore.Mvc;
using octo_lounge_accountant_api.Data;
using octo_lounge_accountant_api.Models;
using octo_lounge_accountant_api.ModelsDTO;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;
using octo_lounge_accountant_api.Services;


namespace octo_lounge_accountant_api.Controllers


{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly HttpClient _httpClient;
        private readonly OpenAIService _openAIService;

        public RecordsController(DataContext context, HttpClient httpClient, OpenAIService openAIService)
        {
            _context = context;
            _httpClient = httpClient;
            _openAIService = openAIService;
        }

        [HttpPost("createRecordGPT/{ownerId}")]
        public async Task<IActionResult> CreateRecordGPT(int ownerId, [FromBody] string input)
        {
            // Get the accounts for the owner
            var accounts = _context.Accounts.Where(a => a.OwnerId == ownerId).ToList();

            // Check if accounts are found
            if (accounts == null || !accounts.Any())
            {
                return BadRequest("No accounts found for the specified owner.");
            }

            // Create a string representation of the accounts
            var accountsListString = string.Join("\n", accounts.Select(a => $"ID: {a.Id}, Name: {a.Name}, Number: {a.AccountNumber}"));

            // Construct the prompt for OpenAI
            string prompt = @$"
Given the following accounts:
{accountsListString}

And the user input:
""{input}""

Please extract the transaction details and provide them as a JSON object in the following format:
{{
  ""Date"": ""YYYY-MM-DD"",
  ""Amount"": amount,
  ""Description"": ""Description of the transaction"",
  ""DebitorId"": debit account ID,
  ""CreditorId"": credit account ID
}}

Ensure that the account IDs correspond to the accounts provided. If you cannot extract the information, respond with an empty string.
";

            // Get response from OpenAI
            var response = await _openAIService.GetResponseFromOpenAI(prompt);

            if (string.IsNullOrWhiteSpace(response))
            {
                return BadRequest("Unable to extract transaction details from the input.");
            }

            try
            {
                // Parse the JSON response
                var recordData = JsonConvert.DeserializeObject<RecordDTO>(response.Trim());

                if (recordData == null)
                {
                    return BadRequest("Failed to parse transaction details.");
                }

                // Validate that the DebitorId and CreditorId exist in the accounts list
                var validDebitor = accounts.Any(a => a.Id == recordData.DebitorId);
                var validCreditor = accounts.Any(a => a.Id == recordData.CreditorId);

                if (!validDebitor || !validCreditor)
                {
                    return BadRequest("Invalid DebitorId or CreditorId.");
                }

                // Create a new Record
                Record record = new Record
                {
                    Date = recordData.Date,
                    Amount = recordData.Amount,
                    Description = recordData.Description,
                    CreditorId = recordData.CreditorId,
                    DebitorId = recordData.DebitorId,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Records.Add(record);
                await _context.SaveChangesAsync();

                return Ok(record);
            }
            catch (Exception ex)
            {
                // Handle any parsing or saving exceptions
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }


        [HttpPost("createRecord")]
        public IActionResult CreateRecord([FromBody] RecordDTO recordDto)
        {
            if (recordDto == null)
            {
                return BadRequest("Record data is null.");
            }
            Record record = new Record
            {
                Date = recordDto.Date,
                Amount = recordDto.Amount,
                Description = recordDto.Description,
                CreditorId = recordDto.CreditorId,
                DebitorId = recordDto.DebitorId
            };

            _context.Records.Add(record);
            _context.SaveChanges();

            return Ok(record);
        }
        
        [HttpGet("getRecordsByDebitorId/{id}")]
        public IActionResult GetRecordsByDebitorId(int id)
        {
            var records = _context.Records.Where(r => r.DebitorId == id).ToList();
            if (records == null)
            {
                return NotFound("Records not found.");
            }

            return Ok(records);
        }

        [HttpGet("getRecordsByCreditorId/{id}")]
        public IActionResult GetRecordsByCreditorId(int id)
        {
            var records = _context.Records.Where(r => r.CreditorId == id).ToList();
            if (records == null)
            {
                return NotFound("Records not found.");
            }

            return Ok(records);
        }

        [HttpDelete("deleteRecord/{id}")]
        public IActionResult DeleteRecord(int id)
        {
            var record = _context.Records.Find(id);
            if (record == null)
            {
                return NotFound("Record not found.");
            }

            _context.Records.Remove(record);
            _context.SaveChanges();

            return Ok("Record deleted successfully.");
        }

        [HttpPut("editRecord/{id}")]
        public IActionResult EditRecord(int id, [FromBody] RecordDTO recordDto)
        {
            if (recordDto == null)
            {
                return BadRequest("Record data is null.");
            }
            var record = _context.Records.Find(id);
            if (record == null)
            {
                return NotFound("Record not found.");
            }

            record.Date = recordDto.Date;
            record.Amount = recordDto.Amount;
            record.Description = recordDto.Description;
            record.CreditorId = recordDto.CreditorId;
            record.DebitorId = recordDto.DebitorId;

            _context.Records.Update(record);
            _context.SaveChanges();

            return Ok(record);
        }
    }
}
