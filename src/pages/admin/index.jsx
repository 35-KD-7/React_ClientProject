import React from "react";
import { message, Layout } from "antd";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../compoments/header";
import LeftNav from "../../compoments/left-nav";
import memoryUtils from "../../utils/memoryUtils";

const { Footer, Sider, Content } = Layout;

export default function Admin() {
  const [messageApi, contextHolder] = message.useMessage();
  const user = memoryUtils.user;
  React.useEffect(() => {
    //
    messageApi.success("登录成功" + user.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !user || !user._id ? (
    <Navigate to="/" replace />
  ) : (
    <div style={{ height: "100%" }}>
      {contextHolder}
      <Layout style={{ minHeight: "100%" }}>
        <Sider width={220} style={{ backgroundColor: "#fff" }}>
          <LeftNav />
        </Sider>
        <Layout>
          <Header />
          <Content style={{ backgroundColor: "#fff", margin: "20px" }}>
            {/* 路由的渲染 */}
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center", color: "#ccc" }}>
            推荐使用谷歌浏览器
          </Footer>
        </Layout>
      </Layout>
    </div>
  );
}
