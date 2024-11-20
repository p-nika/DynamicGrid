using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query.Internal;
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
                              .ThenInclude(t => t.ColumnInfo)
                              .Include(t => t.Rows)
                              .ThenInclude(r => r.Values)
                              .FirstOrDefaultAsync(t => t.Name == request.TableName);
            if (table == null)
            {
                return NotFound($"Table with Name {request.TableName} not found.");
            }
            Column newColumn = new Column() { Name = request.ColumnName, TableId = table.Id };
            if (request.ColumnType == ColumnType.ExtCollection)
            {
                AddExternalCollectionColumnRequest extRequest = (AddExternalCollectionColumnRequest)request;
                newColumn.ColumnInfo = new ExternalCollection()
                {
                    ReferringToTableId = extRequest.ReferringToTableId,
                    ReferringToColumnId = extRequest.ReferringToColumnId,
                    ColumnType = ColumnType.ExtCollection,
                    ColumnId = newColumn.Id,
                    TableId = table.Id,
                    Column = newColumn
                };
            }
            else
            {
                newColumn.ColumnInfo = new ColumnInfo()
                {
                    ColumnType = ColumnType.Text,
                    ColumnId = newColumn.Id,
                    TableId = table.Id,
                    Column = newColumn
                };
            }


            table.Columns.Add(newColumn);
            table.Rows.ForEach(r => r.Values.Add(new CellValue() { ColInd = table.Columns.Count, Row = r, RowId = r.Id, Value = "", CellType = newColumn.ColumnInfo.ColumnType }));
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
                                       .ThenInclude(c => c.ColumnInfo)
                                       .Include(t => t.Rows)
                                       .ThenInclude(t => t.Values)
                                       .ToListAsync();

            return Ok(tables);
        }

        [HttpPost("add-row")]
        public async Task<IActionResult> AddRow([FromBody] AddRowRequest request)
        {
            var table = await _context.Tables
                              .Include(t => t.Columns)   
                              .ThenInclude(c => c.ColumnInfo)
                              .Include(t => t.Rows)
                              .FirstOrDefaultAsync(t => t.Id == request.TableId);
            Row newRow = new Row() { TableId = request.TableId, RowInd = table.Rows.Count + 1};
            for(int i = 0; i < table.Columns.Count; i++)
            {
                var newCellValue = new CellValue()
                {
                    Value = "",
                    RowId = newRow.Id,
                    ColInd = i + 1,
                    CellType = table.Columns[i].ColumnInfo.ColumnType
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

        [HttpDelete("delete-row")]
        public async Task<IActionResult> RemoveRows([FromBody] RemoveRowsRequest request)
        {
            var table = await _context.Tables
                                       .Include(t => t.Rows)
                                       .ThenInclude(r => r.Values)
                                       .FirstOrDefaultAsync(t => t.Id == request.TableId);
            if (table == null)
            {
                return NotFound("Table not found.");
            }
            Queue<int> indexCounts = new Queue<int>();
            table.Rows.ForEach(r =>
            {
                int cnt = 0;
                request.RowInds.ForEach(ind => cnt += r.RowInd > ind ? 1 : 0); //TODO: maybe implement it efficiently
                // r.RowInd -= cnt;
                if (!request.RowInds.Contains(r.RowInd))
                {
                    indexCounts.Enqueue(cnt);
                }
            });
            table.Rows.RemoveAll(r => request.RowInds.Contains(r.RowInd));
            table.Rows.ForEach(r => r.RowInd -= indexCounts.Dequeue());
            await _context.SaveChangesAsync();
            return Ok("Rows deleted successfully!");

        }

        [HttpDelete("delete-column")]
        public async Task<IActionResult> RemoveColumns([FromBody] RemoveColumnRequest request)
        {
            var table = await _context.Tables
                              .Include(t => t.Columns)
                              .Include(t => t.Rows)
                              .ThenInclude(r => r.Values)
                              .FirstOrDefaultAsync(t => t.Id == request.TableId);

            if (table == null) { return NotFound("Table not found"); }

            List<Column> columnsToRemove = new List<Column>();
            request.ColumnInds.ForEach(ind => columnsToRemove.Add(table.Columns[ind-1]));
            columnsToRemove.ForEach(col => table.Columns.Remove(col));


            if (table.Rows.Count > 0)
            {
                Queue<int> IndexCounts = new Queue<int>();
                table.Rows[0].Values.ForEach(cv =>
                {
                    request.ColumnInds.ForEach(ind =>
                    {
                        int cnt = 0;
                        request.ColumnInds.ForEach(ind => cnt += cv.ColInd > ind ? 1 : 0);
                        if (!request.ColumnInds.Contains(cv.ColInd))
                        {
                            IndexCounts.Enqueue(cnt);
                        }
                    });
                });

                table.Rows.ForEach(r =>
                {
                    r.Values.RemoveAll(cv => request.ColumnInds.Contains(cv.ColInd));
                    Queue<int> tmp = new Queue<int>(IndexCounts);
                    r.Values.ForEach(cv => cv.ColInd -= tmp.Dequeue());
                });
            }
            await _context.SaveChangesAsync();
            return Ok("Columns deleted successfully!");
        }

    }
}
