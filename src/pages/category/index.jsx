import React, { useEffect, useState, useRef } from "react";
import { Card, Table, Button, Modal, message } from "antd";
import { PlusOutlined, ArrowRightOutlined } from "@ant-design/icons";
import AddForm from "./addForm";
import UpdateForm from "./updateForm";
import { reqCategory, reqUpdateCategory, reqAddCategory } from "../../api";
import "./index.css";

export default function Category() {
  // 一级列表的数据，只要不重新发送请求，页面数据就不会变
  const [categorys, setCategorys] = useState([]);
  // 二级列表的数据
  const [subCategorys, setSubCategorys] = useState([]);
  // 表示当前页面渲染的是列别下的数据
  const [parentId, setParentId] = useState("0");
  const [parentName, setParentName] = useState("一级分类页表");
  // 当前你点击的哪个数据
  const [category, setCategory] = useState({});
  // 需要一个 form 实例对象，然后获取 表单数据
  const [form, setForm] = useState({});

  const parentRef = useRef();
  useEffect(() => {
    parentRef.current = parentId;
  }, [parentId]);

  // 配置列表的列
  const columns = [
    {
      title: "列别名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "操作",
      width: "300px",
      render: (category) => {
        return (
          <span className="operation">
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                const p1 = Promise.resolve(setCategory(category));
                p1.then(() => {
                  setVisitable(2);
                });
              }}
            >
              修改分类
            </a>
            {parentRef.current === "0" ? (
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  // 这时候就需要重新渲染页面了，所以数据也是保存在 state 里面的
                  // 你肯定要知道是哪个二级列表啊，也就是父亲要知道是谁
                  const p1 = Promise.resolve(setParentId(category._id));
                  p1.then(() => {
                    getCategory(parentRef.current);
                    setParentName(category.name);
                  });
                }}
              >
                查看子分类
              </a>
            ) : null}
          </span>
        );
      },
    },
  ];
  // 控制弹窗的变量
  const [visiable, setVisitable] = useState(0);

  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    // 发送数据啊：获取一级列表
    getCategory(parentRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 请求类别数据
  async function getCategory(parentID) {
    // 需要传递渲染哪个列别的数据，也就是 parentId
    const result = await reqCategory(parentID);
    if (result.status === 0) {
      if (parentID === "0") {
        setCategorys(result.data);
      } else {
        setSubCategorys(result.data);
      }
    } else {
      messageApi.error("类别数据请求失败");
    }
  }

  // 更新分类名称
  async function updateCategory() {
    const categoryName = form.getFieldValue("categoryName");
    const categoryId = category._id;
    const result = await reqUpdateCategory({ categoryId, categoryName });
    if (result.status === 0) {
      getCategory(parentRef.current);
    } else {
      messageApi.error("类别名称更新失败");
    }

    setVisitable(0);
    form.resetFields(["categoryName"]);
  }

  async function addCategory() {
    const parentID = form.getFieldValue("parentCategory");
    const categoryName = form.getFieldValue("categoryName");

    const result = await reqAddCategory({ parentId: parentID, categoryName });
    if (result.status === 0) {
      if (parentID === parentId) {
        getCategory(parentID);
      }
    } else {
      messageApi.error("类别名称更新失败");
    }

    setVisitable(0);
    form.resetFields(["parentCategory", "categoryName"]);
  }

  return (
    <Card
      title={
        parentRef.current === "0" ? (
          parentName
        ) : (
          <span>
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                const p1 = Promise.resolve(setParentId("0"));
                p1.then(() => {
                  setParentName("一级分类页表");
                });
              }}
              style={{ marginRight: "10px", color: "#3652ff" }}
            >
              一级分类页表
            </a>
            <ArrowRightOutlined /> <span>{parentName}</span>
          </span>
        )
      }
      extra={
        <Button type="primary" onClick={() => setVisitable(1)}>
          <PlusOutlined />
          添加
        </Button>
      }
    >
      {contextHolder}
      <Table
        dataSource={parentRef.current === "0" ? categorys : subCategorys}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{ defaultPageSize: 9, showQuickJumper: true }}
      />
      {/* 弹窗 */}

      <Modal
        title="添加分类"
        open={visiable === 1}
        onOk={addCategory}
        onCancel={() => {
          setVisitable(0);
          form.resetFields(["parentCategory", "categoryName"]);
        }}
      >
        <AddForm
          parentId={parentRef.current}
          categorys={categorys}
          getForm={(formObj) => {
            setForm(formObj);
          }}
        />
      </Modal>

      <Modal
        title="更新类别"
        open={visiable === 2}
        onOk={updateCategory}
        onCancel={() => {
          setVisitable(0);
          form.resetFields(["categoryName"]);
        }}
      >
        <UpdateForm
          getForm={(formObj) => {
            setForm(formObj);
          }}
        />
      </Modal>
    </Card>
  );
}

/**
 * 功能1：渲染一级列表数据
 * 功能2：渲染二级列表数据
 * 功能3：修改数据
 * 功能4：添加数据
 */
