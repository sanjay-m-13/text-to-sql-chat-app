"use client";

import {
  Card,
  Typography,
  Table,
  Tag,
  Alert,
  Collapse,
  Tabs,
  Button,
  Space,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarChartOutlined,
  TableOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Chart from "./Chart";
import DataSummary from "./DataSummary";
import { analyzeData } from "../utils/dataAnalyzer";

interface QueryColumn {
  name: string;
  type: string;
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
  const [activeTab, setActiveTab] = useState("0");
  const [chartType, setChartType] = useState<
    "bar" | "line" | "pie" | "scatter"
  >("bar");

  // Analyze data for summary
  const dataSummary = result.success && result.data ? analyzeData(result.data) : null;

  // Determine if we should show charts
  const shouldShowCharts =
    result.success &&
    result.data &&
    result.data.length > 0 &&
    result.data.length <= 1000;

  // Create table columns
  const tableColumns = result.success && result.data && result.data.length > 0
    ? Object.keys(result.data[0]).map((column) => ({
        title: column,
        dataIndex: column,
        key: column,
        render: (value: any) => 
          value === null ? (
            <Typography.Text type="secondary" italic>
              NULL
            </Typography.Text>
          ) : (
            String(value)
          ),
      }))
    : [];

  // Create table data
  const tableData = result.success && result.data
    ? result.data.map((row, index) => ({ ...row, key: index }))
    : [];

  return (
    <div style={{ marginTop: "16px" }}>
      {/* Query Status */}
      <Space align="center" style={{ marginBottom: "16px" }}>
        {result.success ? (
          <CheckCircleOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "#ff4d4f", fontSize: "20px" }} />
        )}
        <Typography.Title level={4} style={{ margin: 0, fontWeight: 600 }}>
          {result.success ? "Query Executed Successfully" : "Query Failed"}
        </Typography.Title>
        {result.success && result.rowCount !== undefined && (
          <Tag color="blue">
            {`${result.rowCount} row${result.rowCount !== 1 ? "s" : ""}`}
          </Tag>
        )}
      </Space>

      {/* Explanation */}
      <Typography.Paragraph
        style={{ 
          marginBottom: "16px", 
          fontStyle: "italic", 
          color: "#8c8c8c" 
        }}
      >
        {result.explanation}
      </Typography.Paragraph>

      {/* SQL Query */}
      <Collapse
        style={{ marginBottom: "16px" }}
        items={[
          {
            key: "sql",
            label: (
              <Typography.Text strong style={{ fontSize: "16px" }}>
                SQL Query
              </Typography.Text>
            ),
            children: (
              <pre
                style={{
                  backgroundColor: "#f5f5f5",
                  padding: "16px",
                  borderRadius: "6px",
                  overflow: "auto",
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: "14px",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  margin: 0,
                }}
              >
                {result.sql}
              </pre>
            ),
          },
        ]}
      />

      {/* Error Display */}
      {!result.success && result.error && (
        <Alert
          message="Query Error"
          description={result.error}
          type="error"
          style={{ marginBottom: "16px" }}
        />
      )}

      {/* Results Display with Tabs */}
      {result.success && result.data && result.data.length > 0 && (
        <div>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ marginBottom: "16px" }}
            items={[
              ...(shouldShowCharts
                ? [
                    {
                      key: "0",
                      label: (
                        <span>
                          <BarChartOutlined />
                          Chart
                        </span>
                      ),
                      children: (
                        <div>
                          {/* Chart Type Selector */}
                          <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                            <Button.Group>
                              <Button
                                type={chartType === "bar" ? "primary" : "default"}
                                onClick={() => setChartType("bar")}
                              >
                                Bar
                              </Button>
                              <Button
                                type={chartType === "line" ? "primary" : "default"}
                                onClick={() => setChartType("line")}
                              >
                                Line
                              </Button>
                              <Button
                                type={chartType === "pie" ? "primary" : "default"}
                                onClick={() => setChartType("pie")}
                              >
                                Pie
                              </Button>
                              <Button
                                type={chartType === "scatter" ? "primary" : "default"}
                                onClick={() => setChartType("scatter")}
                              >
                                Scatter
                              </Button>
                            </Button.Group>
                          </div>
                          {/* D3 Chart */}
                          <Card style={{ padding: "16px" }}>
                            <Chart
                              data={result.data || []}
                              chartType={chartType}
                              width={700}
                              height={400}
                            />
                          </Card>
                        </div>
                      ),
                    },
                  ]
                : []),
              {
                key: shouldShowCharts ? "1" : "0",
                label: (
                  <span>
                    <FileTextOutlined />
                    Summary
                  </span>
                ),
                children: dataSummary ? <DataSummary summary={dataSummary} /> : null,
              },
              {
                key: shouldShowCharts ? "2" : "1",
                label: (
                  <span>
                    <TableOutlined />
                    Table
                  </span>
                ),
                children: (
                  <div style={{ maxHeight: 400, overflow: "auto" }}>
                    <Table
                      size="small"
                      scroll={{ y: 400 }}
                      dataSource={tableData}
                      columns={tableColumns}
                      pagination={false}
                    />
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* No Results Message */}
      {result.success && (!result.data || result.data.length === 0) && (
        <Alert
          message="No Results"
          description="Query executed successfully but returned no results."
          type="info"
        />
      )}
    </div>
  );
}
