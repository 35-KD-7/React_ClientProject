import React, { useEffect } from "react";
import { Form, Input } from "antd";

export default function AddRole(props) {
  const [form] = Form.useForm();
  useEffect(() => {
    // 直接把实例对象传递给父组件
    props.getForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Form
      layout="vertical"
      form={form}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        name="roleName"
        label="角色名称"
        rules={[
          {
            required: true,
            message: "请输入角色名称",
          },
        ]}
      >
        <Input placeholder="请输入新添加角色名称" />
      </Form.Item>
    </Form>
  );
}
