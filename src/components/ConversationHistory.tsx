"use client";

import { Button, Typography, List } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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
    <div
      style={{
        width: drawerWidth,
        height: "100vh",
        backgroundColor: "#fafafa",
        borderRight: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div style={{ padding: "24px", borderBottom: "1px solid #f0f0f0" }}>
        <Button
          block
          icon={<PlusOutlined />}
          onClick={onNewConversation}
          style={{
            height: "40px",
            borderRadius: "8px",
            fontWeight: 500,
          }}
        >
          New chat
        </Button>
      </div>

      {/* Conversations List */}
      <div style={{ flex: 1, overflow: "auto", padding: "16px" }}>
        <Typography.Text
          type="secondary"
          style={{
            fontSize: "12px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: "16px",
            display: "block",
            paddingLeft: "16px",
          }}
        >
          Recent
        </Typography.Text>

        <List
          dataSource={conversationHistory}
          renderItem={(conversation) => (
            <List.Item
              key={conversation.id}
              style={{
                padding: 0,
                marginBottom: "4px",
                border: "none",
              }}
            >
              <div
                onClick={() => onSelectConversation(conversation.id)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedConversation === conversation.id
                      ? "#10a37f"
                      : "transparent",
                  color:
                    selectedConversation === conversation.id
                      ? "white"
                      : "#262626",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  if (selectedConversation !== conversation.id) {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedConversation !== conversation.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <Typography.Text
                    style={{
                      fontWeight: 500,
                      color:
                        selectedConversation === conversation.id
                          ? "white"
                          : "#262626",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: "4px",
                    }}
                  >
                    {conversation.title}
                  </Typography.Text>
                  <Typography.Text
                    type="secondary"
                    style={{
                      fontSize: "11px",
                      color:
                        selectedConversation === conversation.id
                          ? "rgba(255,255,255,0.8)"
                          : "#8c8c8c",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {conversation.lastMessage}
                  </Typography.Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
