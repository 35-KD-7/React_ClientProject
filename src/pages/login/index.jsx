import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";

import login from "./images/xidian_logo3.png";
import { reqLogin } from "../../api";
import memoryUtils from "../../utils/memoryUtils";
import { saveUser } from "../../utils/storageUtils";

import "./login.css";

export default function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const nagative = useNavigate();
  async function onFinish(value) {
    const { username, password } = value;
    const response = await reqLogin(username, password);
    if (typeof response === "string") {
      messageApi.error(response);
    } else {
      // 这还还需对进行用户名和密码的校对
      if (response.status === 0) {
        // 跳转页面
        nagative("admin", { replace: true });
        memoryUtils.user = response.data;
        saveUser(response.data);
      } else {
        messageApi.error("用户名或密码错误");
      }
    }
  }

  function onFinishFailed() {
    messageApi.error("请按正确格式输入用户名和密码");
  }
  function validator(_, value) {
    if (!value) {
      return Promise.reject(new Error("密码不能为空"));
    } else if (value.length < 4) {
      return Promise.reject(new Error("密码长度不能小于4"));
    } else if (value.length > 12) {
      return Promise.reject(new Error("密码长度不能大于12"));
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject("密码必须是字母数字下划线");
    } else {
      return Promise.resolve();
    }
  }
  // 将用户输入存入 state，并且是同步是
  const [fields, setFields] = useState({});

  return memoryUtils.user && memoryUtils.user._id ? (
    <Navigate to="admin" replace />
  ) : (
    <div className="login">
      <header className="login_header">
        {/* 注意 react 不支持直接写图片的相对地址 */}
        {/* 应该直接将图片以变量的形式引入 */}
        <div className="wrapper">
          <img src={login} alt="" />
          <h1>西电管理系统</h1>
        </div>
      </header>
      <section className="login_content">
        <h2>用户登陆</h2>

        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          fields={fields}
          onFieldsChange={(_, allFields) => {
            setFields(allFields);
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          {/* 输入框 */}
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "用户名不能为空",
              },
              {
                type: "string",
                min: 2,
                message: "用户名长度不能小于两位",
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} />
          </Form.Item>
          {/* 密码框 */}
          <Form.Item
            name="password"
            rules={[
              {
                validator: validator,
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          {contextHolder}
          {/* 提交按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登陆
            </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  );
}
