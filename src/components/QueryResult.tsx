"use client";

import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

interface QueryColumn {
  name: string;
  dataType: number;
}

interface QueryResultData {
  success: boolean;
  sql: string;
  explanation: string;
  data?: Record<string, unknown>[];
  rowCount?: number;
  columns?: QueryColumn[];
  error?: string;
}

interface QueryResultProps {
  result: QueryResultData;
}

export default function QueryResult({ result }: QueryResultProps) {
  return (
    <Box sx={{ mt: 2 }}>
      {/* Query Status */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        {result.success ? (
          <CheckCircleIcon sx={{ color: "success.main" }} />
        ) : (
          <ErrorIcon sx={{ color: "error.main" }} />
        )}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {result.success ? "Query Executed Successfully" : "Query Failed"}
        </Typography>
        {result.success && result.rowCount !== undefined && (
          <Chip
            label={`${result.rowCount} row${result.rowCount !== 1 ? "s" : ""}`}
            size="small"
            color="primary"
          />
        )}
      </Box>

      {/* Explanation */}
      <Typography
        variant="body1"
        sx={{ mb: 2, fontStyle: "italic", color: "text.secondary" }}
      >
        {result.explanation}
      </Typography>

      {/* SQL Query */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            SQL Query
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box
            component="pre"
            sx={{
              bgcolor: "grey.100",
              p: 2,
              borderRadius: 1,
              overflow: "auto",
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: "0.875rem",
              lineHeight: 1.5,
              whiteSpace: "pre-wrap",
            }}
          >
            {result.sql}
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Error Display */}
      {!result.success && result.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Error:</strong> {result.error}
          </Typography>
        </Alert>
      )}

      {/* Results Table */}
      {result.success && result.data && result.data.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 400, overflow: "auto" }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {Object.keys(result.data[0]).map((column) => (
                  <TableCell
                    key={column}
                    sx={{
                      fontWeight: 600,
                      bgcolor: "primary.50",
                      borderBottom: "2px solid",
                      borderColor: "primary.200",
                    }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {result.data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": {
                      bgcolor: "grey.50",
                    },
                    "&:hover": {
                      bgcolor: "primary.50",
                    },
                  }}
                >
                  {Object.values(row).map((value, cellIndex) => (
                    <TableCell key={cellIndex}>
                      {value === null ? (
                        <Typography
                          variant="body2"
                          sx={{ fontStyle: "italic", color: "text.secondary" }}
                        >
                          NULL
                        </Typography>
                      ) : (
                        String(value)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Results */}
      {result.success && result.data && result.data.length === 0 && (
        <Alert severity="info">
          <Typography variant="body2">
            Query executed successfully but returned no results.
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
