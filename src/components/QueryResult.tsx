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
  Tabs,
  Tab,
  Button,
  ButtonGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import BarChartIcon from "@mui/icons-material/BarChart";
import TableChartIcon from "@mui/icons-material/TableChart";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useState } from "react";
import D3Chart from "./D3Chart";
import DataSummary from "./DataSummary";
import { analyzeData } from "../utils/dataAnalyzer";

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
  const [activeTab, setActiveTab] = useState(0);
  const [chartType, setChartType] = useState<
    "bar" | "line" | "pie" | "scatter"
  >("bar");

  // Analyze the data if query was successful
  const dataSummary =
    result.success && result.data ? analyzeData(result.data) : null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const shouldShowCharts =
    result.success &&
    result.data &&
    result.data.length > 0 &&
    result.data.length <= 1000;

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

      {/* Results Visualization */}
      {shouldShowCharts && (
        <Box sx={{ mb: 2 }}>
          {/* Tabs for different views */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab icon={<BarChartIcon />} label="Chart" />
              <Tab icon={<AssessmentIcon />} label="Summary" />
              <Tab icon={<TableChartIcon />} label="Table" />
            </Tabs>
          </Box>

          {/* Chart Tab */}
          {activeTab === 0 && (
            <Box>
              {/* Chart Type Selector */}
              <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
                <ButtonGroup size="small" variant="outlined">
                  <Button
                    variant={chartType === "bar" ? "contained" : "outlined"}
                    onClick={() => setChartType("bar")}
                  >
                    Bar
                  </Button>
                  <Button
                    variant={chartType === "line" ? "contained" : "outlined"}
                    onClick={() => setChartType("line")}
                  >
                    Line
                  </Button>
                  <Button
                    variant={chartType === "pie" ? "contained" : "outlined"}
                    onClick={() => setChartType("pie")}
                  >
                    Pie
                  </Button>
                  <Button
                    variant={chartType === "scatter" ? "contained" : "outlined"}
                    onClick={() => setChartType("scatter")}
                  >
                    Scatter
                  </Button>
                </ButtonGroup>
              </Box>

              {/* D3 Chart */}
              <Paper elevation={1} sx={{ p: 2 }}>
                <D3Chart
                  data={result.data || []}
                  chartType={chartType}
                  width={700}
                  height={400}
                />
              </Paper>
            </Box>
          )}

          {/* Summary Tab */}
          {activeTab === 1 && dataSummary && (
            <DataSummary summary={dataSummary} />
          )}

          {/* Table Tab */}
          {activeTab === 2 && (
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
                              sx={{
                                fontStyle: "italic",
                                color: "text.secondary",
                              }}
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
        </Box>
      )}

      {/* Fallback Table for non-chart data */}
      {result.success &&
        result.data &&
        result.data.length > 0 &&
        !shouldShowCharts && (
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
                            sx={{
                              fontStyle: "italic",
                              color: "text.secondary",
                            }}
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
