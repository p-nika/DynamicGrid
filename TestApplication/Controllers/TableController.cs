using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TestApplication.Models;
using TestApplication.Requests;

namespace TestApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TableController : ControllerBase
    {
        ApplicationDbContext _context;
        public TableController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("create-table")]
        public async Task<IActionResult> CreateTable([FromBody] Table table)
        {
            _context.Tables.Add(table);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(CreateTable), new { columns = table.Columns }, table);
        }

        [HttpPost("add-column")]
        public async Task<IActionResult> AddColumn([FromBody] AddColumnRequest request)
        {
            var table = await _context.Tables   
                              .Include(t => t.Columns)
                              .FirstOrDefaultAsync(t => t.Name == request.TableName);
            if (table == null)
            {
                return NotFound($"Table with Name {request.TableName} not found.");
            }
            Column newColumn = new Column() { Name = request.ColumnName, TableId = table.Id };
            table.Columns.Add(newColumn);
            if (_context.Entry(table).State == EntityState.Detached)
            {
                _context.Tables.Attach(table);
            }

            _context.Entry(table).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return AcceptedAtAction(nameof(AddColumn), new {tableId = table.Id});
        }

        [HttpGet("get-tables")]
        public async Task<ActionResult<List<Table>>> GetTables()
        {
            var tables = await _context.Tables
                                       .Include(t => t.Columns)
                                       .Include(t => t.Rows)
                                       .ThenInclude(t => t.Values)
                                       .ToListAsync();

            return Ok(tables);
        }

        [HttpPost("add-row")]
        public async Task<IActionResult> AddRow([FromBody] AddRowRequest request)
        {
            var table = await _context.Tables
                              .Include(t => t.Rows)
                              .FirstOrDefaultAsync(t => t.Id == request.TableId);
            Row newRow = new Row() { TableId = request.TableId, RowInd = table.Rows.Count + 1};
            for(int i = 0; i < request.Values.Count; i++)
            {
                var newCellValue = new CellValue()
                {
                    Value = request.Values[i].ToString(),
                    RowId = newRow.Id,
                    ColInd = i + 1,
                };
                newRow.Values.Add(newCellValue);
            }
            _context.Rows.Add(newRow);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddRow), new { RowId = newRow.Id });
        }

        [HttpPatch("change-cell")]
        public async Task<IActionResult> ChangeCell([FromBody] ChangeCellRequest request)
        {
            var table = await _context.Tables
                                       .Include(t => t.Rows)
                                       .ThenInclude(r => r.Values)
                                       .FirstOrDefaultAsync(t => t.Id == request.TableId);

            if (table == null)
            {
                return NotFound("Table not found.");
            }
            var row = table.Rows.FirstOrDefault(r => r.RowInd == request.RowInd);

            if (row == null)
            {
                return NotFound("Row not found.");
            }

            var cellValue = row.Values.FirstOrDefault(c => c.ColInd == request.ColInd);

            if (cellValue == null)
            {
                return NotFound("Cell value not found.");
            }

            cellValue.Value = request.Value;

            await _context.SaveChangesAsync();

            return Ok("Cell updated successfully.");
        }

    }
}
