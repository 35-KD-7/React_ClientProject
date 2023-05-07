import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";

export default function AddOrUpdateUser(props) {
  const [form] = Form.useForm();
  const option = props.roles.map((role) => {
    return { value: role._id, label: role.name };
  });
  const { user } = props;
  useEffect(() => {
    props.getForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Form
      form={form}
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 16,
      }}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: "请输入用户名",
          },
        ]}
        initialValue={user.username}
      >
        <Input placeholder="请输入用户名" />
      </Form.Item>
      {user._id ? null : (
        <Form.Item
          label="密码"
          name="password"
          rules={[
            {
              required: true,
              message: "请输入密码",
            },
          ]}
        >
          <Input type="password" placeholder="请输入用密码" />
        </Form.Item>
      )}
      <Form.Item label="手机号" name="phone" initialValue={user.phone}>
        <Input placeholder="请输入手机号" />
      </Form.Item>
      <Form.Item label="邮箱" name="email" initialValue={user.email}>
        <Input placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item
        label="角色"
        name="role_id"
        rules={[
          {
            required: true,
            message: "请选则角色",
          },
        ]}
        initialValue={user.role_id}
      >
        <Select
          placeholder="请选择需要的角色"
          style={{
            width: 160,
          }}
          //   onChange={handleChange}
          options={option}
        />
      </Form.Item>
    </Form>
  );
}
