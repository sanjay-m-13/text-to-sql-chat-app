"use client";

import { Typography, Space, Card } from "antd";
import { RobotOutlined } from "@ant-design/icons";

export default function WelcomeScreen() {
  const examples = [
    "Show me all customers by status",
    "Find orders from the last 30 days",
    "Count products by category",
    "Display sales trends over time",
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        flexDirection: "column",
        maxWidth: "768px",
        margin: "0 auto",
        padding: "64px 24px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "#10a37f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
          }}
        >
          <RobotOutlined style={{ fontSize: 40, color: "white" }} />
        </div>

        <Typography.Title
          level={1}
          style={{
            fontWeight: 600,
            color: "#262626",
            marginBottom: "16px",
            fontSize: "2.125rem",
          }}
        >
          SQL Assistant
        </Typography.Title>

        <Typography.Paragraph
          style={{
            maxWidth: 600,
            margin: "0 auto",
            lineHeight: 1.6,
            fontSize: "1.125rem",
            color: "#8c8c8c",
          }}
        >
          Transform your natural language questions into SQL queries and get
          instant results with beautiful visualizations.
        </Typography.Paragraph>
      </div>

      <div style={{ width: "100%", maxWidth: 600 }}>
        <Typography.Title
          level={3}
          style={{
            fontWeight: 500,
            color: "#262626",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Try these examples
        </Typography.Title>

        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          {examples.map((example, index) => (
            <Card
              key={index}
              hoverable
              style={{
                borderRadius: "8px",
                transition: "all 0.2s ease-in-out",
              }}
              bodyStyle={{ padding: "24px" }}
            >
              <Typography.Text
                style={{
                  color: "#262626",
                  fontWeight: 500,
                  fontSize: "16px",
                }}
              >
                {example}
              </Typography.Text>
            </Card>
          ))}
        </Space>
      </div>
    </div>
  );
}
