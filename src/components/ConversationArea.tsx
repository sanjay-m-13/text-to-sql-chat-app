'use client';

import {
  Box,
  Stack,
} from '@mui/material';
import { Message } from 'ai';
import { useRef, useEffect } from 'react';
import WelcomeScreen from './WelcomeScreen';
import MessageBubble from './MessageBubble';
import LoadingMessage from './LoadingMessage';

interface ConversationAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ConversationArea({ messages, isLoading }: ConversationAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <Stack spacing={3}>
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                index={index}
              />
            ))}
            {isLoading && <LoadingMessage />}
          </Stack>
        )}
        <div ref={messagesEndRef} />
      </Box>
    </Box>
  );
}
