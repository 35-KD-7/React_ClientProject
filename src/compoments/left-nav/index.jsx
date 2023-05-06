import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "antd";
import "./index.css";
import logo from "./images/logo.png";
import menuItems from "../../config/menuConfig";
import memoryUtils from "../../utils/memoryUtils";

//  实现只有一个子菜单是展开的
const rootSubmenuKeys = { goods: "sub1", charts: "sub2" };

export default function LeftNav() {
  const pathname = useLocation().pathname.substring(7);

  const [openKeys, setOpenKeys] = useState(
    pathname.includes("/")
      ? [rootSubmenuKeys[pathname.substring(0, pathname.indexOf("/"))]]
      : []
  );

  const onOpenChange = (keys) => {
    // key 就是现在打开的 subMenu
    setOpenKeys(keys);
    // 但是存在无效打开的情况，打开啥都没点
  };

  const onclick = ({ keyPath }) => {
    if (keyPath.length < 2) {
      setOpenKeys([]);
    } else {
      setOpenKeys([keyPath[1]]);
    }
  };

  const getItems = () => {
    // 超级管理员
    if (memoryUtils.user._id === "643bc4d54971fb16a0ece61c") {
      return menuItems;
    } else {
      const { menus } = memoryUtils.user.role;
      let Item = menuItems.reduce((pre, items) => {
        // 如果有这个权限
        if (menus.indexOf(items.key) !== -1) {
          if (items.children) {
            // 有子组件
            let newItems = { ...items };
            pre.children = items.children.reduce((pre, item) => {
              if (menus.indexOf(item.key) !== -1) {
                pre.push({ ...item });
              }
              return pre;
            }, []);
            pre.push(newItems);
          } else {
            pre.push({ ...items });
          }
        }
        return pre;
      }, []);

      // 'home' 必须展示，即使没有权限
      if (menus.indexOf("home") === -1) {
        Item.unshift(menuItems[0]);
      }
      return Item;
    }
  };
  return (
    <div className="left-nav">
      <header className="left-nav-header">
        <img src={logo} alt="logo" />
        <h1>研究生管理系统</h1>
      </header>

      <Menu
        mode="inline"
        openKeys={openKeys} // 你把这个定死了
        selectedKeys={
          pathname.indexOf("goods/product") === 0 ? "goods/product" : pathname
        }
        onOpenChange={onOpenChange}
        onClick={onclick}
        style={{
          width: 220,
          backgroundColor: "#4f68ff",
          color: "#fff",
          fontWeight: "700",
        }}
        items={getItems()}
      />
    </div>
  );
}
