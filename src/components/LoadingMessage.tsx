"use client";

import { Typography, Avatar, Spin } from "antd";
import { RobotOutlined } from "@ant-design/icons";

export default function LoadingMessage() {
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
          backgroundColor: "#595959",
          flexShrink: 0,
        }}
        icon={<RobotOutlined />}
      />

      {/* Loading Content */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: "4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Spin size="small" />
          <Typography.Text type="secondary" style={{ fontSize: "16px" }}>
            Analyzing your query and generating results...
          </Typography.Text>
        </div>
      </div>
    </div>
  );
}
