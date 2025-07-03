"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const drawerWidth = 280;

// Mock conversation history data
const conversationHistory = [
  {
    id: "1",
    title: "User registration queries",
    lastMessage: "SELECT * FROM users WHERE...",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    title: "Product analytics",
    lastMessage: "How to find top selling products?",
    timestamp: "1 day ago",
  },
  {
    id: "3",
    title: "Order management",
    lastMessage: "JOIN orders with customers",
    timestamp: "2 days ago",
  },
  {
    id: "4",
    title: "Database optimization",
    lastMessage: "CREATE INDEX for better performance",
    timestamp: "1 week ago",
  },
];

interface ConversationHistoryProps {
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
}

export default function ConversationHistory({
  selectedConversation,
  onSelectConversation,
  onNewConversation,
}: ConversationHistoryProps) {
  return (
    <Box
      sx={{
        width: drawerWidth,
        height: "100vh",
        bgcolor: "grey.50",
        borderRight: "1px solid",
        borderColor: "grey.200",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, borderBottom: "1px solid", borderColor: "grey.200" }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={onNewConversation}
          sx={{
            py: 1.5,
            borderRadius: "8px",
            borderColor: "grey.300",
            color: "text.primary",
            "&:hover": {
              borderColor: "grey.400",
              bgcolor: "grey.100",
            },
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          New chat
        </Button>
      </Box>

      {/* Conversations List */}
      <Box sx={{ flex: 1, overflow: "auto", px: 2, py: 2 }}>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 2,
            px: 2,
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Recent
        </Typography>

        <List sx={{ p: 0 }}>
          {conversationHistory.map((conversation, index) => (
            <ListItem key={conversation.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selectedConversation === conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                sx={{
                  borderRadius: "8px",
                  py: 1.5,
                  px: 2,
                  minHeight: "auto",
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                  },
                  "&:hover": {
                    bgcolor:
                      selectedConversation === conversation.id
                        ? "primary.dark"
                        : "grey.100",
                  },
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <Box sx={{ width: "100%", overflow: "hidden" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5,
                      color:
                        selectedConversation === conversation.id
                          ? "white"
                          : "text.primary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conversation.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        selectedConversation === conversation.id
                          ? "rgba(255,255,255,0.8)"
                          : "text.secondary",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: "11px",
                    }}
                  >
                    {conversation.lastMessage}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
}
