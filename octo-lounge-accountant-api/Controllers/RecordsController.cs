using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using octo_lounge_accountant_api.Data;
using octo_lounge_accountant_api.Models;
using octo_lounge_accountant_api.ModelsDTO;

namespace octo_lounge_accountant_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecordsController : ControllerBase
    {

        private readonly DataContext _context;

        public RecordsController(DataContext context)
        {
            _context = context;
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
