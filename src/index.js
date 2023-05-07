import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { getUser } from "./utils/storageUtils";
import memoryUtils from "./utils/memoryUtils";

// 将 localStorage 里面的用户信息保存到 内存 里面
memoryUtils.user = getUser();
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
