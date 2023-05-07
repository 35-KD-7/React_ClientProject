import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import { PAGE_SIZE } from "../../config/constant";
import { dateFormat } from "../../utils/dateUtils";
import { reqAddOrUpdateUser, reqDeleteUser, reqUsers } from "../../api";
import AddOrUpdateUser from "./addOrUpdateUser";

export default function User() {
  // 消息弹窗
  const [messageApi, contextHolder] = message.useMessage();
  // 用户列表
  const [users, setUsers] = useState([]);
  // 角色列表
  const [roles, setRoles] = useState([]);
  // 角色id - 角色name map
  const [rolesMap, setRolesMap] = useState({});
  const [visiable, setVisiable] = useState(0);
  // 当前选中的 user，可能是修改，也可能是删除
  const [userNow, setUserNow] = useState({});
  // 子组件 Form 的内容
  const [form, setForm] = useState({});
  // 列的配置列表
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "电话",
      dataIndex: "phone",
    },
    {
      title: "注册时间",
      dataIndex: "create_time",
      render: dateFormat,
    },
    {
      title: "所属角色",
      dataIndex: "role_id",
      render: (roleId) => {
        return roleId ? rolesMap[roleId] : null;
      },
    },
    {
      title: "操作",
      render: (user) => {
        return (
          <span>
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                setUserNow(user);
                setVisiable(1);
                if (form.setFields) {
                  form.setFields([
                    { name: "username", value: user.username },
                    { name: "phone", value: user.phone },
                    { name: "email", value: user.email },
                    { name: "role_id", value: user.role_id },
                  ]);
                }
              }}
              style={{ marginRight: "10px", color: "#3652ff" }}
            >
              修改
            </a>
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                setUserNow(user);
                setVisiable(2);
              }}
              style={{ marginRight: "10px", color: "#3652ff" }}
            >
              删除
            </a>
          </span>
        );
      },
    },
  ];
  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 获取所有成员数据
  const getUsers = async () => {
    const result = await reqUsers();
    if (result.status === 0) {
      setUsers(result.data.users);
      setRoles(result.data.roles);

      const map = result.data.roles.reduce((pre, role) => {
        pre[role._id] = role.name;
        return pre;
      }, {});
      setRolesMap(map);
    } else {
      messageApi.error("成员数据获取失败");
    }
  };

  // 删除用户
  const deleteUser = async () => {
    const result = await reqDeleteUser(userNow._id);
    if (result.status === 0) {
      messageApi.success("删除" + userNow.username + "成功");
      getUsers();
    } else {
      messageApi.error("删除" + userNow.username + "失败");
    }
  };

  // 添加用户
  const addOrUpdateUser = async () => {
    setVisiable(0);
    // 这需要发送请求，添加角色啊
    // 1. 先确保 form 的表单验证正确
    try {
      const user = await form.validateFields();
      if (userNow._id) {
        // 更新
        user._id = userNow._id;
      }
      const result = await reqAddOrUpdateUser(user);
      if (result.status === 0) {
        messageApi.success("用户" + (userNow._id ? "修改" : "创建") + "成功");
        getUsers();
      } else {
        messageApi.error("用户" + (userNow._id ? "修改" : "创建") + "失败");
      }
    } catch (error) {
      messageApi.error("用户" + (userNow._id ? "修改" : "创建") + "失败");
    }
    form.resetFields();
  };

  const title = (
    <Button
      onClick={() => {
        setUserNow({});
        setVisiable(1);
        if (form.setFields) {
          form.setFields([
            { name: "username", value: "" },
            { name: "password", value: "" },
            { name: "phone", value: "" },
            { name: "email", value: "" },
            { name: "role_id", value: "" },
          ]);
        }
      }}
    >
      创建用户
    </Button>
  );
  return (
    <Card title={title}>
      {contextHolder}
      <Table
        dataSource={users}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          defaultPageSize: PAGE_SIZE,
        }}
      />

      <Modal
        title="删除用户"
        open={visiable === 2}
        onOk={() => {
          deleteUser();
          setVisiable(0);
        }}
        onCancel={() => {
          setVisiable(0);
        }}
      >
        确定删除 {userNow.username} 吗
      </Modal>

      <Modal
        title={(userNow._id ? "修改" : "添加") + "用户"}
        open={visiable === 1}
        onOk={addOrUpdateUser}
        onCancel={() => {
          setVisiable(0);
          form.resetFields();
        }}
      >
        <AddOrUpdateUser
          roles={roles}
          user={userNow}
          getForm={(formObj) => {
            setForm(formObj);
          }}
        />
      </Modal>
    </Card>
  );
}
