import React, { useEffect } from "react";
import { Form, Input } from "antd";

export default function UpdateForm(props) {
  const [form] = Form.useForm();
  useEffect(() => {
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
      <Form.Item name="categoryName">
        <Input placeholder="请输入修改后的分类名称" />
      </Form.Item>
    </Form>
  );
}
