import React, { useState, useEffect, useRef } from "react";
import { Card, Button, Table, message, Modal } from "antd";
import { PAGE_SIZE } from "../../config/constant";
import { reqRoles, reqAddRole, reqUpdateRole } from "../../api";
import AddRole from "./addRole";
import UpdateRole from "./updateRole";
import memoryUtils from "../../utils/memoryUtils";
import { dateFormat } from "../../utils/dateUtils";

export default function Role() {
  // 顶部错误提示的 API
  const [messageApi, contextHolder] = message.useMessage();
  // 存储所有角色的列表(读取数据)
  const [roles, setRoles] = useState([]);
  // 表格列的指定数组，设置列的格式，每个列的设置是一个对象
  const columns = [
    {
      title: "角色名称",
      dataIndex: "name", //和哪一列关联，可以不写
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      render: dateFormat,
    },
    {
      title: "授权时间",
      dataIndex: "auth_time",
      render: (auth_time) => {
        return auth_time ? dateFormat(auth_time) : "";
      },
    },
    {
      title: "授权人",
      dataIndex: "auth_name",
    },
  ];
  // 存储当前单选框选中的角色(点击改行，才进行更新数据)
  const [role, setRole] = useState({});

  // 直接返回 Form 的实例对象，接下来就可以操作 Form
  const [form1, setForm1] = useState({});
  const [form2, setForm2] = useState({});

  /**
   * visiable：控制Modal组件的显示
   * visiable === 1：显示添加角色的 Modal
   * visiable === 2：显示角色权限的 Modal
   * visiable === 0：什么 Modal 都不显示
   */
  const [visiable, setVisiable] = useState(0);
  /**
   *  Card 是一个固定组件能配置头部的样式: title 和 extra
   */
  const title = (
    <span>
      <Button type="primary" onClick={() => setVisiable(1)}>
        创建角色
      </Button>
      &nbsp;&nbsp;
      <Button
        type="primary"
        disabled={!role._id}
        onClick={() => {
          setVisiable(2);
          if (form2.setFieldValue) {
            form2.setFieldValue("roleName", role.name);
          }
        }}
      >
        {/*设置按钮不可操作,一旦有角色被选中，该按钮就生效*/}
        设置角色权限
      </Button>
    </span>
  );

  // 获取子组件的数据
  const checked = useRef();

  useEffect(() => {
    getRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getRoles() {
    const result = await reqRoles();
    if (result.status === 0) {
      setRoles(result.data);
    } else {
      messageApi.error("角色数据获取失败");
    }
  }
  /**
   * 设置行的属性
   * 参数就是：改行的数据，自动获取得到
   * 返回值是个对象，对象内配置了时间的回调函数
   * 这儿有个细节，这个数组其实就是这个 record 的来源就是 roles
   * 也就是role指向的也是roles的内部
   */
  function onRow(record) {
    return {
      onClick: () => {
        setRole(record);
      },
    };
  }

  async function addRole() {
    setVisiable(0);
    // 这需要发送请求，添加角色啊
    // 1. 先确保 form 的表单验证正确
    try {
      const { roleName } = await form1.validateFields();

      // 发送请求
      const result = await reqAddRole(roleName);
      if (result.status === 0) {
        // 直接更新 roles 数组即可，就不要再次发请求获取了
        // 这个 setRoles 是可以传递一个函数作为参数的，函数的参数是原来的 roles，函数的返回值必须是新的 roles
        setRoles((value) => {
          return [...roles, result.data];
        });
      } else {
        messageApi.error("角色创建失败");
      }
    } catch (error) {
      messageApi.error("角色创建失败");
    }
    form1.resetFields();
  }

  async function updateRole() {
    setVisiable(0);
    // 获取子节点的数据
    const menus = checked.current.props.checkedKeys;
    // role 对象地址是没有改变的，但是内部的menus是被改掉了
    role.menus = menus;
    // 除了设置权限，还需要设置谁给他选项，直接调用存在内存的用户即可
    role.auth_name = memoryUtils.user.username;

    // 发请求更新角色
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      messageApi.success("角色数据更新成功");
      // 这儿还需要把 roles 的角色重新渲染一下啊，这儿不能直接那role更新，需要重新获取数据
      getRoles();
    } else {
      messageApi.error("角色数据更新失败");
    }
  }
  return (
    <Card title={title}>
      {contextHolder}
      {/**
       * pagination：配置分页
       * rowSelection：配置行是否可选
       * onRow：设置行属性，比如说点击了这行怎么办
       */}
      <Table
        dataSource={roles}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          defaultPageSize: PAGE_SIZE,
        }}
        rowSelection={{
          type: "radio",
          selectedRowKeys: [role._id],
          // 没有这个函数，直接点击单选框会有bug
          onChange: (_, record) => {
            setRole(record[0]);
          },
        }}
        onRow={onRow}
      />

      {/**
       *  下面是按钮点击触发的Modal组件
       */}
      <Modal
        title="添加用户"
        open={visiable === 1}
        onOk={addRole}
        onCancel={() => {
          setVisiable(0);
          form1.resetFields();
        }}
      >
        <AddRole
          getForm={(formObj) => {
            setForm1(formObj);
          }}
        />
      </Modal>

      <Modal
        title="设置用户权限"
        open={visiable === 2}
        onOk={updateRole}
        onCancel={() => {
          setVisiable(0);
        }}
      >
        <UpdateRole
          role={role}
          ref={checked}
          getForm={(formObj) => {
            setForm2(formObj);
          }}
        />
      </Modal>
    </Card>
  );
}
