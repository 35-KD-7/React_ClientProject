import React, { useState } from "react";
import login from "./images/xidian_logo3.png";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import "./login.css";

export default function Login() {
  function onFinish(value) {
    // event.preventDefault();
    console.log("发送Ajax请求----" + value);
  }

  function onFinishFailed({ values, errorFields, outOfDate }) {
    console.log("校验错误");
    console.log(values, errorFields, outOfDate);
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
  // 将用户输入存入 state
  const [fields, setFields] = useState({});
  function handleUsername() {
    console.log(fields[0].value);
  }
  function handlePassword() {
    console.log(fields[1].value);
  }
  return (
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
                validator: validator,
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              onBlur={handleUsername}
            />
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
              onBlur={handlePassword}
            />
          </Form.Item>
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
