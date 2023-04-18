import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";

import "antd/dist/reset.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#19528f",
      },
    }}
  >
    <App />
  </ConfigProvider>
);
