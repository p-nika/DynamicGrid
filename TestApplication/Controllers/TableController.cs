using System.ComponentModel;
using System.Xml.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TestApplication.Models;
using TestApplication.Requests;
using TestApplication.Responses;

namespace TestApplication.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TableController : ControllerBase
    {
        ApplicationDbContext _context;
        TypeMapper _mapper;
        public TableController(ApplicationDbContext context, TypeMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpPost("create-table")]
        public async Task<IActionResult> CreateTable([FromBody] Table table)
        {
            Table tmpTable = await _context.Tables.FirstOrDefaultAsync(t => t.Name == table.Name);
            if(tmpTable != null)
            {
                return BadRequest($"Table with the name {table} already exists");
            }
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
            Column newColumn = new Column() { Name = request.ColumnName, TableId = table.Id, IsValidated = request.IsValidated };
            if (request.ColumnType == ColumnType.ExtCollection)
            {
                AddExternalCollectionColumnRequest extRequest = (AddExternalCollectionColumnRequest)request;
                var referringTable = await _context.Tables.Include(t => t.Columns).FirstOrDefaultAsync(t => t.Id == extRequest.ReferringToTableId);
                if(referringTable == null)
                {
                    return NotFound($"Table with Id {extRequest.ReferringToTableId} not found.");
                }
                if(referringTable.Columns.FirstOrDefault(c => c.Id == extRequest.ReferringToColumnId) == null)
                {
                    return NotFound($"Column with id {extRequest.ReferringToColumnId} not found in table with id {extRequest.ReferringToTableId}");
                }
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
                    ColumnType = request.ColumnType,
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

        [HttpGet("get-table/{tableId}")]
        public async Task<IActionResult> GetTable(int tableId)
        {
            Table table = await _context.Tables
                                       .Include(t => t.Columns)
                                       .ThenInclude(c => c.ColumnInfo)
                                       .Include(t => t.Rows)
                                       .ThenInclude(t => t.Values)
                                       .FirstOrDefaultAsync(t => t.Id == tableId);
            if (table == null)
            {
                return NotFound("Table not found!");
            }
            return Ok(table);
        }

        [HttpGet("access-table/{tableName}/{email}")]
        public async Task<IActionResult> AccessTable(string tableName, string email)
        {
            Table table = await _context.Tables.FirstOrDefaultAsync(t => t.Name == tableName);
            if (table == null)
            {
                return NotFound("Table not found!");
            }
            Table permissionsTable = await _context.Tables.Include(t => t.Rows).ThenInclude(r => r.Values).FirstOrDefaultAsync(t => t.Id == 1);
            EmailValue userEmail = new EmailValue() { Email = email };
            NumericValue tableId = new NumericValue() { Number = table.Id };
            bool hasPermission = false;
            foreach(Row r in permissionsTable.Rows)
            {
                bool good = true;
                r.Values.ForEach(cv =>
                {
                    if (cv.CellType == ColumnType.Email)
                    {
                        if (cv.GetValue<EmailValue>().Email != email)
                        {
                            good = false;
                        }
                    }
                    else if (cv.CellType == ColumnType.Numeric)
                    {
                        if (cv.GetValue<NumericValue>().Number != table.Id)
                        {
                            good = false;
                        }
                    }
                });
                if (good)
                {
                    hasPermission = true;
                    break;
                }
            }
            User user = await _context.Users.FirstOrDefaultAsync(us => us.Email == email);
            if(user == null)
            {
                return NotFound($"User with email {email} not found");
            }
            if (!user.IsAdmin && !hasPermission)
            {
                return Ok(new AccessTableResponse() { Success = false });
            }
            return Ok(new AccessTableResponse() { Success = true, TableId = table.Id});
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
            table.Rows.Add(newRow);
            // _context.Rows.Add(newRow);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddRow), new { RowId = newRow.Id });
        }

        [HttpPatch("change-cell")]
        public async Task<IActionResult> ChangeCell([FromBody] ChangeCellRequest request)
        {
            var table = await _context.Tables
                                       .Include(t => t.Rows)
                                       .ThenInclude(r => r.Values)
                                       .Include(t => t.Columns)
                                       .ThenInclude(c => c.ColumnInfo)
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
            Column column = table.Columns[request.ColInd-1];
            string message = "";
            bool isOk = !column.IsValidated || _mapper.Validate(column.ColumnInfo.ColumnType, request.Value, out message);
            if (isOk)
            {
                _mapper.SetValue(column.ColumnInfo.ColumnType, request.Value, cellValue);
            }
            else
            {
                return BadRequest(message);
            }

            await _context.SaveChangesAsync();

            return Ok("Cell updated successfully.");
        }

        [HttpDelete("delete-extcollection-value")]
        public async Task<IActionResult> DeleteExtCollectionValue([FromBody] DeleteExtCollectionValueRequest request)
        {
            var table = await _context.Tables
                                        .Include(t => t.Rows)
                                        .ThenInclude(r => r.Values)
                                        .FirstOrDefaultAsync(t => t.Id == request.TableId);
            if(table == null)
            {
                return NotFound($"Table with id {request.TableId} not found");
            }

            CellValue value = table.Rows.FirstOrDefault(r => r.Id == request.RowId).Values.FirstOrDefault(v => v.ColInd == request.ColInd);

            if(value == null)
            {
                return NotFound($"cell with rowId {request.RowId} and colInd {request.ColInd} not found");
            }

            if(value.CellType != ColumnType.ExtCollection)
            {
                return BadRequest("cell is not a reference to anything");
            }
            ExternalCollectionValues referringValues = value.GetValue<ExternalCollectionValues>();
            if (!referringValues.ReferringRowIds.Contains(request.ToRemoveReferenceRowId))
            {
                return BadRequest($"cell doesn't contain a reference to {request.ToRemoveReferenceRowId}");
            }
            referringValues.ReferringRowIds.Remove(request.ToRemoveReferenceRowId);
            value.SetValue<ExternalCollectionValues>(referringValues);
            await _context.SaveChangesAsync();
            return Ok("Reference removed successfully");

        }

        [HttpDelete("delete-row")]
        public async Task<IActionResult> RemoveRows([FromBody] RemoveRowsRequest request)
        {
            var tables = await _context.Tables
                                       .Include(t => t.Rows)
                                       .ThenInclude(r => r.Values)
                                       .ToListAsync();
            var table = tables.FirstOrDefault(t => t.Id == request.TableId);
            if (table == null)
            {
                return NotFound("Table not found.");
            }

            Queue<int> indexCounts = new Queue<int>();
            List<Row> rowsToRemove = new List<Row>();
            table.Rows.ForEach(r =>
            {
                int cnt = 0;
                request.RowInds.ForEach(ind => cnt += r.RowInd > ind ? 1 : 0); //TODO: maybe implement it efficiently
                if (!request.RowInds.Contains(r.RowInd))
                {
                    indexCounts.Enqueue(cnt);
                }
                else
                {
                    rowsToRemove.Add(r);
                }
            });

            // Collect all the delete tasks to await later
            List<Task> deleteTasks = new List<Task>();

            rowsToRemove.ForEach(r =>
            {
                tables.ForEach(t =>
                {
                    t.Rows.ForEach(tr =>
                    {
                        tr.Values.ForEach(async val =>
                        {
                            if (val.CellType == ColumnType.ExtCollection)
                            {
                                ExternalCollectionValues values = val.GetValue<ExternalCollectionValues>();
                                if (values.ReferringRowIds.Contains(r.Id))
                                {
                                    // Prepare the delete request
                                    DeleteExtCollectionValueRequest deleteRequest = new DeleteExtCollectionValueRequest
                                    {
                                        TableId = t.Id,
                                        RowId = tr.Id,
                                        ColInd = val.ColInd,
                                        ToRemoveReferenceRowId = r.Id
                                    };

                                    // Add the delete task to the list instead of calling it directly
                                    deleteTasks.Add(DeleteExtCollectionValue(deleteRequest));
                                }
                            }
                        });
                    });
                });
            });

            // Wait for all delete tasks to complete before removing rows and saving
            await Task.WhenAll(deleteTasks);

            // Now remove the rows
            table.Rows.RemoveAll(r => request.RowInds.Contains(r.RowInd));
            table.Rows.ForEach(r => r.RowInd -= indexCounts.Dequeue());

            // Save changes after all deletions have been handled
            await _context.SaveChangesAsync();

            return Ok("Rows deleted successfully!");
        }


        [HttpDelete("delete-column")]
        public async Task<IActionResult> RemoveColumns([FromBody] RemoveColumnRequest request)
        {
            var tables = await _context.Tables
                              .Include(t => t.Columns)
                              .ThenInclude(c => c.ColumnInfo)
                              .Include(t => t.Rows)
                              .ThenInclude(r => r.Values)
                              .ToListAsync();
            var table = tables.Where(t => t.Id == request.TableId).FirstOrDefault();

            if (table == null) { return NotFound("Table not found"); }

            List<Column> columnsToRemove = new List<Column>();
            request.ColumnInds.ForEach(ind => columnsToRemove.Add(table.Columns[ind-1]));
            Dictionary<int, List<int>> Table_Columns = [];
            columnsToRemove.ForEach(col => 
            {
                tables.ForEach(t =>
                {
                    t.Columns.Where(c => c.ColumnInfo.ColumnType == ColumnType.ExtCollection && (c.ColumnInfo as ExternalCollection).ReferringToColumnId == col.Id).ToList().ForEach(c =>
                    {
                        if (!Table_Columns.ContainsKey(c.TableId))
                        {
                            Table_Columns[c.TableId] = new List<int>();
                        }
                        Table_Columns[c.TableId].Add(t.Columns.IndexOf(c) + 1);
                    });
                });
            });
            foreach (var item in Table_Columns)
            {
                RemoveColumnRequest newRequest = new RemoveColumnRequest() { TableId = item.Key, ColumnInds = item.Value };
                await RemoveColumns(newRequest);
            }
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
                if (table.Rows[0].Values.Count == 0)
                {
                    table.Rows.Clear();
                }
            }
            await _context.SaveChangesAsync();
            return Ok("Columns deleted successfully!");
        }

        [HttpGet("get-ext-column-info/{rowId}/{colInd}")]
        public async Task<GetExtCollectionInfoResponse> GetExternalColumnInfo(int rowId, int colInd)
        {
            var table = await _context.Tables
                              .Include(t => t.Columns)
                              .ThenInclude(c => c.ColumnInfo)
                              .Include(t => t.Rows)
                              .FirstOrDefaultAsync(t => t.Rows.Select(r => r.Id).Contains(rowId));

            GetExtCollectionInfoResponse response = new GetExtCollectionInfoResponse() { TableId = table.Id };
            response.RowInd = table.Rows.Where(r => r.Id == rowId).First().RowInd;
            response.ColumnInfo = (ExternalCollection)table.Columns[colInd - 1].ColumnInfo;
            return response;
        }

        [HttpGet("get-col-values/{tableId}/{colId}")]
        public async Task<IActionResult> GetColValues(int tableId, int colId)
        {
            var table = await _context.Tables.Include(t => t.Columns).Include(t => t.Rows).ThenInclude(r => r.Values).FirstOrDefaultAsync(t => t.Id == tableId);
            if(table == null)
            {
                return NotFound("Table not found");
            }
            Column column = table.Columns.FirstOrDefault(c => c.Id == colId);
            if(column == null)
            {
                return NotFound("Column not found");
            }
            int ind = table.Columns.IndexOf(column) + 1;
            List<GetColValuesResponse> values = table.Rows.Select(r => new GetColValuesResponse() { Value = r.Values.FirstOrDefault(cv => cv.ColInd == ind).Value, RowId = r.Id }).ToList();
            return CreatedAtAction(nameof(GetColValues), values);
        }


        [HttpPost("add-ext-value")]
        public async Task<IActionResult> AddExternalValue([FromBody] AddExternalValueRequest request)
        {
            var table = await _context.Tables.Include(t => t.Columns).Include(t => t.Rows).ThenInclude(r => r.Values).FirstOrDefaultAsync(t => t.Id == request.TableId);
            if (table == null)
            {
                return NotFound("Table not found");
            }
            Row row = table.Rows.FirstOrDefault(r => r.Id == request.RowId);
            if(row == null)
            {
                return NotFound("Row not found");
            }

            CellValue cv = row.Values.FirstOrDefault(cv => cv.ColInd == request.ColInd);
            if(cv == null)
            {
                return NotFound("Cell not found");
            }
            ExternalCollectionValues values;
            if(cv.Value == "")
            {
                values = new ExternalCollectionValues();
            }
            else
            {
                values = cv.GetValue<ExternalCollectionValues>();
            }
            values.ReferringRowIds.Add(request.ReferringRowId);
            cv.SetValue<ExternalCollectionValues>(values);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(AddExternalValue), values);
        }

    }
}
