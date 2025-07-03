"use client";

import { Typography, Card, Row, Col, Tag, List, Space } from "antd";
import {
  FileTextOutlined,
  TableOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DotChartOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { DataSummary as DataSummaryType } from "../utils/dataAnalyzer";

interface DataSummaryProps {
  summary: DataSummaryType;
}

export default function DataSummary({ summary }: DataSummaryProps) {
  const getChartIcon = (chartType: string) => {
    switch (chartType) {
      case "bar":
        return <BarChartOutlined />;
      case "line":
        return <LineChartOutlined />;
      case "pie":
        return <PieChartOutlined />;
      case "scatter":
        return <DotChartOutlined />;
      default:
        return <TableOutlined />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "number":
        return "primary";
      case "string":
        return "secondary";
      case "date":
        return "success";
      case "boolean":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
      >
        <AssessmentIcon color="primary" />
        Data Insights
      </Typography>

      <Grid container spacing={3}>
        {/* Main Insights Card */}
        <Grid item xs={12}>
          <Card
            elevation={1}
            sx={{ border: "1px solid", borderColor: "grey.200" }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
              >
                What this data tells us
              </Typography>
              <Stack spacing={2}>
                {summary.keyInsights.map((insight, index) => (
                  <Box
                    key={index}
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        mt: 1,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        lineHeight: 1.6,
                        fontSize: "16px",
                      }}
                    >
                      {insight}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats Card */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={1}
            sx={{ border: "1px solid", borderColor: "grey.200" }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Stats
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Records found
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: "primary.main" }}
                  >
                    {summary.totalRows.toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Data fields
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, color: "secondary.main" }}
                  >
                    {summary.columns.length}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Best visualization
                  </Typography>
                  <Chip
                    icon={getChartIcon(summary.suggestedChartType)}
                    label={`${
                      summary.suggestedChartType.charAt(0).toUpperCase() +
                      summary.suggestedChartType.slice(1)
                    } Chart`}
                    size="medium"
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Fields Card */}
        <Grid item xs={12}>
          <Card
            elevation={1}
            sx={{ border: "1px solid", borderColor: "grey.200" }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Data Fields Overview
              </Typography>
              <Stack spacing={2}>
                {summary.columns.map((column, index) => (
                  <Box
                    key={index}
                    sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        {column.name}
                      </Typography>
                      <Chip
                        label={
                          column.type === "number"
                            ? "Numbers"
                            : column.type === "string"
                            ? "Text"
                            : column.type === "date"
                            ? "Dates"
                            : "Boolean"
                        }
                        size="small"
                        color={getTypeColor(column.type) as any}
                        variant="outlined"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {column.uniqueValues === 1
                        ? "All values are the same"
                        : column.uniqueValues === summary.totalRows
                        ? "Every value is unique"
                        : `Contains ${column.uniqueValues} different values`}
                      {column.nullCount > 0 && ` (${column.nullCount} missing)`}
                    </Typography>

                    {column.sampleValues.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ fontWeight: 500 }}
                        >
                          Examples:
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.primary"
                          sx={{ ml: 1 }}
                        >
                          {column.sampleValues
                            .slice(0, 3)
                            .map(String)
                            .join(", ")}
                          {column.sampleValues.length > 3 && "..."}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
