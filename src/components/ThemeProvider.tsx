"use client";

import { ConfigProvider, theme } from "antd";
import { ReactNode } from "react";

interface AntdThemeProviderProps {
  children: ReactNode;
}

export default function AntdThemeProvider({
  children,
}: AntdThemeProviderProps) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: "#10a37f",
          colorSuccess: "#52c41a",
          colorWarning: "#faad14",
          colorError: "#ff4d4f",
          colorInfo: "#1677ff",
          borderRadius: 8,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          fontSize: 14,
          colorBgContainer: "#ffffff",
          colorBgElevated: "#ffffff",
          colorBgLayout: "#f5f5f5",
          colorBorder: "#d9d9d9",
          colorBorderSecondary: "#f0f0f0",
          colorText: "#262626",
          colorTextSecondary: "#8c8c8c",
          colorTextTertiary: "#bfbfbf",
          boxShadow:
            "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)",
          boxShadowSecondary:
            "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
        },
        components: {
          Button: {
            borderRadius: 6,
            fontWeight: 500,
          },
          Input: {
            borderRadius: 8,
            paddingInline: 12,
          },
          Card: {
            borderRadius: 12,
            boxShadow:
              "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
          },
          Table: {
            borderRadius: 8,
          },
          Tabs: {
            inkBarColor: "#10a37f",
            itemActiveColor: "#10a37f",
            itemHoverColor: "#52c41a",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
