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
    <Fade in timeout={300 + index * 100}>
      <Paper
        elevation={isUser ? 0 : 1}
        sx={{
          p: 3,
          bgcolor: isUser ? "primary.50" : "background.paper",
          borderRadius: 3,
          border: isUser ? "1px solid" : "none",
          borderColor: "primary.100",
          ml: isUser ? 6 : 0,
          mr: isUser ? 0 : 6,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
          }}
        >
          <Avatar
            sx={{
              bgcolor: isUser ? "primary.main" : "secondary.main",
              width: 40,
              height: 40,
            }}
          >
            {isUser ? <PersonIcon /> : <SmartToyIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: isUser ? "primary.main" : "secondary.main",
                textTransform: "uppercase",
                letterSpacing: 1,
                mb: 1,
                display: "block",
              }}
            >
              {isUser ? "You" : "Assistant"}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.6,
                fontFamily: containsSQL
                  ? 'Monaco, Menlo, "Ubuntu Mono", monospace'
                  : "inherit",
                bgcolor: containsSQL ? "grey.100" : "transparent",
                p: containsSQL ? 2 : 0,
                borderRadius: 2,
                fontSize: containsSQL ? "0.875rem" : "inherit",
              }}
            >
              {message.content}
            </Typography>

            {/* Render query results */}
            {toolResults.map((result, resultIndex: number) => (
              <QueryResult key={resultIndex} result={result} />
            ))}
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
}
