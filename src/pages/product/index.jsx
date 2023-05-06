/**
 * Product 下面有三个页面 /product  /product/addupdate   /product/detail
 * 功能1：路由匹配
 *
 */
import React from "react";
import { Outlet } from "react-router-dom";

import "./index.css";

export default function Product() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
