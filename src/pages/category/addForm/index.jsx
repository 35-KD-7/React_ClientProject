import React, { useEffect } from "react";
import { Form, Input, Select } from "antd";
import "./index.css";

const { Option } = Select;

export default function AddForm(props) {
  useEffect(() => {
    props.getForm(form);
  });
  const [form] = Form.useForm();
  return (
    <Form
      layout="vertical"
      form={form}
      style={{
        maxWidth: 600,
      }}
    >
      <Form.Item
        label="所属分类"
        name="parentCategory"
        initialValue={props.parentId}
      >
        <Select>
          <Option value="0" key="0">
            一级分类
          </Option>
          {props.categorys.map((category) => {
            return (
              <Option value={category._id} key={category._id}>
                {category.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item label="分类名称" name="categoryName">
        <Input placeholder="请输入分类名称" />
      </Form.Item>
    </Form>
  );
}
