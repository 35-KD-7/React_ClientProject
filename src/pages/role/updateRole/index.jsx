import React, { useEffect, useState, forwardRef } from "react";
import { Form, Input, Tree } from "antd";
import { treeData } from "../../../config/checkedMenu";

const UpdateRole = forwardRef(function UpdateRole(props, ref) {
  const { role } = props;
  const [form] = Form.useForm();

  // 保存被选中的节点，以后只要更新这个数据就ok
  const [checkedKeys, setCheckedKeys] = useState({});

  useEffect(() => {
    // 直接把实例对象传递给父组件
    props.getForm(form);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 这个细节非常重要，这个checkedKeys每次render必须根据role更新
    setCheckedKeys(role.menus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // 这个 checkedKeys 是被点击的数组，所以要更新数据
  const onCheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys);
  };

  return (
    <div>
      <Form
        layout="vertical"
        form={form}
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item name="roleName" label="角色名称" initialValue={role.name}>
          <Input disabled />
        </Form.Item>
      </Form>
      <Tree
        checkable
        defaultExpandAll={true}
        treeData={treeData}
        checkedKeys={checkedKeys} // 选中的节点
        onCheck={onCheck}
        ref={ref}
      />
    </div>
  );
});

export default UpdateRole;
