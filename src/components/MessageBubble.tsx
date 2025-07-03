"use client";

import { Typography, Avatar, Space } from "antd";
import { UserOutlined, RobotOutlined } from "@ant-design/icons";
import { Message } from "ai";
import QueryResult from "./QueryResult";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const containsSQL =
    message.content.includes("SELECT") ||
    message.content.includes("CREATE") ||
    message.content.includes("INSERT") ||
    message.content.includes("UPDATE") ||
    message.content.includes("DELETE");

  // Parse tool results from message
  const toolResults =
    message.toolInvocations
      ?.map((invocation) => {
        if (
          invocation.toolName === "executeQuery" &&
          "result" in invocation &&
          invocation.result
        ) {
          return invocation.result as {
            success: boolean;
            sql: string;
            explanation: string;
            data?: Record<string, unknown>[];
            rowCount?: number;
            columns?: Array<{ name: string; dataType: number }>;
            error?: string;
          };
        }
        return null;
      })
      .filter(
        (result): result is NonNullable<typeof result> => result !== null
      ) || [];

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* Avatar */}
      <Avatar
        size={32}
        style={{
          backgroundColor: isUser ? "#10a37f" : "#595959",
          flexShrink: 0,
        }}
        icon={isUser ? <UserOutlined /> : <RobotOutlined />}
      />

      {/* Message Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Typography.Paragraph
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
            color: "#262626",
            fontSize: "16px",
            fontFamily: containsSQL
              ? 'Monaco, Menlo, "Ubuntu Mono", monospace'
              : "inherit",
            marginBottom: toolResults.length > 0 ? "24px" : 0,
          }}
        >
          {message.content}
        </Typography.Paragraph>

        {/* Render query results */}
        {toolResults.length > 0 && (
          <Space direction="vertical" size={24} style={{ width: "100%" }}>
            {toolResults.map((result, resultIndex: number) => (
              <QueryResult key={resultIndex} result={result} />
            ))}
          </Space>
        )}
      </div>
    </div>
  );
}
