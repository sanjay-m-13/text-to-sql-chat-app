"use client";

import { Paper, Box, Avatar, Typography, Fade } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
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
    <Box
      sx={{
        display: "flex",
        gap: 3,
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: isUser ? "primary.main" : "grey.700",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ fontSize: 18, color: "white" }} />
        ) : (
          <SmartToyIcon sx={{ fontSize: 18, color: "white" }} />
        )}
      </Box>

      {/* Message Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
            color: "text.primary",
            fontSize: "16px",
            fontFamily: containsSQL
              ? 'Monaco, Menlo, "Ubuntu Mono", monospace'
              : "inherit",
            "& code": {
              bgcolor: "grey.100",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.875rem",
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            },
          }}
        >
          {message.content}
        </Typography>

        {/* Render query results */}
        {toolResults.map((result, resultIndex: number) => (
          <Box key={resultIndex} sx={{ mt: 3 }}>
            <QueryResult result={result} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
