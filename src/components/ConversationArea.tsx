"use client";

import { Space } from "antd";
import { Message } from "ai";
import { useRef, useEffect, useCallback } from "react";
import WelcomeScreen from "./WelcomeScreen";
import MessageBubble from "./MessageBubble";
import LoadingMessage from "./LoadingMessage";

interface ConversationAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ConversationArea({
  messages,
  isLoading,
}: ConversationAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLengthRef = useRef(0);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    // Only scroll if messages length has actually changed
    if (messages.length !== prevMessagesLengthRef.current) {
      prevMessagesLengthRef.current = messages.length;

      // Use a small delay to ensure DOM is updated and prevent infinite loops
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 50);

      return () => clearTimeout(timeoutId);
    }
  }, [messages.length, scrollToBottom]);

  // Also scroll when loading state changes (when a response starts/ends)
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const timeoutId = setTimeout(() => {
        scrollToBottom();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, scrollToBottom, messages.length]);

  return (
    <div
      style={{
        flex: 1,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div
          style={{
            maxWidth: "768px",
            margin: "0 auto",
            width: "100%",
            padding: "32px 24px",
          }}
        >
          <Space direction="vertical" size={48} style={{ width: "100%" }}>
            {messages.map((message, index) => (
              <MessageBubble key={message.id} message={message} index={index} />
            ))}
            {isLoading && <LoadingMessage />}
          </Space>
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
