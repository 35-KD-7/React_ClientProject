import React from "react";
import { useRoutes } from "react-router-dom";
import routes from "./config/routes";
import { ConfigProvider } from "antd";
import "antd/dist/reset.css";

export default function App() {
  // 路由表 + useRoutes
  const route = useRoutes(routes);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#19528f",
        },
      }}
    >
      {route}
    </ConfigProvider>
  );
}
