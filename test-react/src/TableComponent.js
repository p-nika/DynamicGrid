import React, { useState } from "react";
import SampleCell from "./SampleCell";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
} from "@mui/material";

const DynamicColumnsTable = () => {
  const [columns, setColumns] = useState([
    { id: "id", label: "ID" },
    { id: "name", label: "Name" },
  ]);

  const [rows, setRows] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ]);
  const addColumn = () => {
    const newColumnId = `column${columns.length + 1}`;
    const newColumn = { id: newColumnId, label: `New Column ${columns.length + 1}` };
    setColumns([...columns, newColumn]);
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        [newColumnId]: "Default Value",
      }))
    );
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={addColumn}>
        Add Column
      </Button>

      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column) => (
                   <TableCell key={column.id}>
                    {
                        <SampleCell />
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DynamicColumnsTable;
