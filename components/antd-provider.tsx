"use client";

import { ConfigProvider, App } from "antd";
import viVN from "antd/locale/vi_VN";

const theme = {
  token: {
    colorPrimary: "#1e40af",
    colorSuccess: "#16a34a",
    colorWarning: "#d97706",
    colorError: "#dc2626",
    colorInfo: "#2563eb",
    borderRadius: 8,
    fontFamily: "var(--font-sans)",
  },
  components: {
    Button: {
      controlHeight: 40,
      paddingInline: 20,
    },
    Input: {
      controlHeight: 44,
      paddingInline: 14,
    },
    Select: {
      controlHeight: 44,
    },
    Card: {
      paddingLG: 24,
    },
    Table: {
      headerBg: "#f8fafc",
      headerColor: "#475569",
      rowHoverBg: "#f1f5f9",
    },
  },
};

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={theme} locale={viVN}>
      <App>{children}</App>
    </ConfigProvider>
  );
}
