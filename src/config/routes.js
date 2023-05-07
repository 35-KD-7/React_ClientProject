// 配置路由表
import { Navigate } from "react-router-dom";
import Login from "../pages/login";
import Admin from "../pages/admin";
import Category from "../pages/category";
import Product from "../pages/product";
import Home from "../pages/home";
import Role from "../pages/role";
import User from "../pages/user";
import Bar from "../pages/charts/bar";
import Line from "../pages/charts/line";
import Pie from "../pages/charts/pie";
import Room707 from "../pages/room/707";
import Room710 from "../pages/room/710";
import Room713 from "../pages/room/713";
import Room714 from "../pages/room/714";
import Room722 from "../pages/room/722";
import Room724 from "../pages/room/724";
import ProductAddUpdate from "../pages/product/addupdate";
import ProductDetail from "../pages/product/detail";
import ProductHome from "../pages/product/home";

const routes = [
  {
    path: "/admin",
    element: <Admin />,
    children: [
      { path: "home", element: <Home /> },
      {
        path: "goods/product",
        element: <Product />,
        children: [
          { path: "addupdate", element: <ProductAddUpdate /> },
          { path: "detail", element: <ProductDetail /> },
          { path: "", element: <ProductHome /> },
        ],
      },
      { path: "goods/category", element: <Category /> },
      { path: "role", element: <Role /> },
      { path: "user", element: <User /> },
      { path: "charts/bar", element: <Bar /> },
      { path: "charts/line", element: <Line /> },
      { path: "charts/pie", element: <Pie /> },
      { path: "room/707", element: <Room707 /> },
      { path: "room/710", element: <Room710 /> },
      { path: "room/713", element: <Room713 /> },
      { path: "room/714", element: <Room714 /> },
      { path: "room/722", element: <Room722 /> },
      { path: "room/724", element: <Room724 /> },
      { path: "", element: <Navigate to="home" /> },
    ],
  },
  { path: "/", element: <Login /> },
];

export default routes;
