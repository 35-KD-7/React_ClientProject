// 配置 Menu 菜单：结构是一个数组
import { Link } from "react-router-dom";

import {
  HomeOutlined,
  UserOutlined,
  AppstoreOutlined,
  BarsOutlined,
  ToolOutlined,
  SafetyCertificateOutlined,
  PieChartOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  LineChartOutlined,
  BankOutlined,
  CarryOutOutlined,
} from "@ant-design/icons";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem(<Link to="./home">首页</Link>, "home", <HomeOutlined />),
  getItem("商品", "sub1", <AppstoreOutlined />, [
    getItem(
      <Link to="./goods/category">品类管理</Link>,
      "goods/category",
      <BarsOutlined />
    ),
    getItem(
      <Link to="./goods/product">商品管理</Link>,
      "goods/product",
      <ToolOutlined />
    ),
  ]),
  getItem(<Link to="./user">用户管理</Link>, "user", <UserOutlined />),
  getItem(
    <Link to="./role">角色管理</Link>,
    "role",
    <SafetyCertificateOutlined />
  ),
  getItem("图标管理", "sub2", <AreaChartOutlined />, [
    getItem(
      <Link to="./charts/bar">柱状图</Link>,
      "charts/bar",
      <BarChartOutlined />
    ),
    getItem(
      <Link to="./charts/line">折线图</Link>,
      "charts/line",
      <LineChartOutlined />
    ),
    getItem(
      <Link to="./charts/pie">饼图</Link>,
      "charts/pie",
      <PieChartOutlined />
    ),
  ]),
  getItem("实验室", "sub3", <BankOutlined />, [
    getItem(<Link to="./room/707">707</Link>, "room/707", <CarryOutOutlined />),
    getItem(<Link to="./room/710">710</Link>, "room/710", <CarryOutOutlined />),
    getItem(<Link to="./room/713">713</Link>, "room/713", <CarryOutOutlined />),
    getItem(<Link to="./room/714">714</Link>, "room/714", <CarryOutOutlined />),
    getItem(<Link to="./room/722">722</Link>, "room/722", <CarryOutOutlined />),
    getItem(<Link to="./room/724">724</Link>, "room/724", <CarryOutOutlined />),
  ]),
];
export default items;
