"use client";

import { Input, Button, Space, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { FormEvent, KeyboardEvent } from "react";

const { TextArea } = Input;

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const form = e.currentTarget.closest("form");
        if (form) {
          const submitEvent = new Event("submit", {
            bubbles: true,
            cancelable: true,
          });
          form.dispatchEvent(submitEvent);
        }
      }
    }
  };

  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        backgroundColor: "#ffffff",
        borderTop: "1px solid #f0f0f0",
        padding: "24px",
        zIndex: 1000,
      }}
    >
      <div style={{ maxWidth: "768px", margin: "0 auto" }}>
        <form onSubmit={onSubmit}>
          <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
            <TextArea
              placeholder="Message SQL Assistant..."
              value={input}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              autoSize={{ minRows: 1, maxRows: 6 }}
              style={{
                borderRadius: "24px",
                fontSize: "16px",
                lineHeight: 1.5,
                padding: "12px 20px",
                resize: "none",
                flex: 1,
              }}
            />
            <Button
              type="primary"
              htmlType="submit"
              disabled={isLoading || !input.trim()}
              icon={<SendOutlined />}
              shape="circle"
              size="large"
              style={{
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  input.trim() && !isLoading ? "#10a37f" : "#d9d9d9",
                borderColor: input.trim() && !isLoading ? "#10a37f" : "#d9d9d9",
              }}
            />
          </div>
        </form>

        {/* Helper text */}
        <div style={{ marginTop: "16px", textAlign: "center" }}>
          <Typography.Text
            type="secondary"
            style={{
              fontSize: "12px",
              backgroundColor: "#f9f9f9",
              padding: "4px 12px",
              borderRadius: "12px",
              border: "1px solid #f0f0f0",
            }}
          >
            Press Enter to send, Shift + Enter for new line
          </Typography.Text>
        </div>
      </div>
    </div>
  );
}
