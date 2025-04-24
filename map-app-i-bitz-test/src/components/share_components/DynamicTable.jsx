import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Typography,
  TableSortLabel,
  TextField,
  Box,
  Button,
} from "@mui/material";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilized = array.map((el, index) => [el, index]);
  stabilized.sort((a, b) => {
    const cmp = comparator(a[0], b[0]);
    if (cmp !== 0) return cmp;
    return a[1] - b[1];
  });
  return stabilized.map((el) => el[0]);
}

function exportToCSV(data, headers) {
  const csvRows = [
    headers.map((h) => h.label).join(","),
    ...data.map((row) =>
      headers.map((h) => JSON.stringify(row[h.key] ?? "")).join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "export.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

export default function DynamicTable({
  data = [],
  headers = [],
  type = "normal",
  rowsPerPageOptions = [100, 200, 1000],
  sort = false,
  search = false,
  exportable = false,
  serverMode = false,
  onPageChange = () => {},
  totalCount = 0,
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

useEffect(() => {
  if (serverMode) {
    onPageChange({ page: page + 1, rowsPerPage });
  }
}, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const normalizedData =
    type === "map" && data?.features
      ? data.features.map((f) => ({
          ...f.properties,
          coordinates: f.geometry.coordinates,
        }))
      : Array.isArray(data)
      ? data
      : [];

  const filteredData = normalizedData.filter((row) =>
    !search
      ? true
      : Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
  );

  const sortedData = sort
    ? stableSort(filteredData, getComparator(order, orderBy))
    : filteredData;
  const paginatedData = serverMode
    ? sortedData
    : sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper elevation={2}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {search && (
          <TextField
            sx={{ width: 300 }}
            size="small"
            label="Search Country"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        {exportable && (
          <Button
          
            variant="outlined"
            onClick={() => exportToCSV(filteredData, headers)}
          >
            Export CSV
          </Button>
        )}
      </Box>
      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableCell
                  key={header.key}
                  sortDirection={sort && orderBy === header.key ? order : false}
                >
                  {sort ? (
                    <TableSortLabel
                      active={orderBy === header.key}
                      direction={orderBy === header.key ? order : "asc"}
                      onClick={() => handleSort(header.key)}
                    >
                      {header.label}
                    </TableSortLabel>
                  ) : (
                    header.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} align="center">
                  <Typography variant="body2">No data available</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <TableRow key={index}>
                  {headers.map((header) => (
                    <TableCell key={header.key}>
                      {row[header.key] ?? "-"}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={serverMode ? totalCount : filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelDisplayedRows={({ from, to }) =>
          serverMode
            ? `${from}–${to} of ${totalCount}`
            : `${from}–${to} of ${filteredData.length}`
        }
      />
    </Paper>
  );
}
