import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Select, Button, Table, Input, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../../../api";
import { PAGE_SIZE } from "../../../config/constant";

const Option = Select.Option;
export default function ProductHome() {
  // 编程式路由跳转
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  // 这两个内容从受控组将上获取
  // 受控组件：就是自动获取数据，onchange
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("productName");
  // 保存当前所在页码
  const [page, setPage] = useState("1");
  const columns = [
    { title: "商品名称", dataIndex: "name" },
    { title: "商品描述", dataIndex: "desc" },
    { title: "价格", dataIndex: "price", render: (price) => "￥" + price },
    {
      width: "100px",
      title: "状态",
      // dataIndex: "status", 如果不写这个，接收到的参数就是整行的数据，写了这个只能接收到状态属性
      render: (product) => {
        const { status, _id } = product;
        return (
          <span>
            <Button
              type="primary"
              onClick={() => {
                updateStatus(_id, status);
              }}
            >
              {status === 1 ? "下架" : "上架"}
            </Button>
            <span>{status === 1 ? "在售" : "已下架"}</span>
          </span>
        );
      },
    },
    {
      width: "100px",
      title: "操作",
      render: (product) => {
        return (
          <span>
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/goods/product/detail", {
                  replace: false,
                  state: product,
                });
              }}
              style={{
                marginRight: "10px",
                color: "#3652ff",
                display: "block",
              }}
            >
              详情
            </a>
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/goods/product/addupdate", {
                  replace: false,
                  state: product,
                });
              }}
              style={{ marginRight: "10px", color: "#3652ff" }}
            >
              修改
            </a>
          </span>
        );
      },
    },
  ];
  const title = (
    <span>
      <Select
        value={searchType}
        style={{ width: "150pxType" }}
        onChange={(value) => setSearchType(value)}
      >
        <Option value="productName">按名称搜索</Option>
        <Option value="productDesc">按描述搜索</Option>
      </Select>
      <Input
        placeholder="关键字"
        value={searchName}
        style={{ width: "150px", margin: "0 15px" }}
        onChange={(event) => setSearchName(event.target.value)}
      />
      <Button
        type="primary"
        onClick={() => {
          getProducts(1);
        }}
      >
        搜索
      </Button>
    </span>
  );
  const extra = (
    <Button
      type="primary"
      onClick={() => {
        navigate("/admin/goods/product/addupdate", {
          replace: false,
        });
      }}
    >
      <PlusOutlined />
      添加
    </Button>
  );

  useEffect(() => {
    getProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 更新商品的状态
  async function updateStatus(productId, status) {
    status = status === 1 ? 2 : 1;
    const result = await reqUpdateStatus({ productId, status });
    if (result.status === 0) {
      messageApi.success("商品状态更新成功");
      // 重新请求当前页数据
      getProducts(page);
    } else {
      messageApi.error("商品状态更新失败");
    }
  }
  // 请求商品数据
  async function getProducts(pageNum) {
    // 保存当前请求的页码
    setPage(pageNum);
    // 这个函数既可以获取所有的数据 也可以 根据搜索获取数据
    let result;
    const pageSize = PAGE_SIZE;
    if (searchName !== "") {
      result = await reqSearchProducts({
        pageNum,
        pageSize,
        searchName,
        searchType,
      });
    } else {
      result = await reqProducts({ pageNum, pageSize });
    }

    if (result.status === 0) {
      setProducts(result.data.list);
      setTotal(result.data.total);
    } else {
      messageApi.error("获取商品数据失败");
    }
  }

  return (
    <Card title={title} extra={extra}>
      {contextHolder}
      <Table
        dataSource={products}
        columns={columns}
        rowKey="_id"
        bordered
        pagination={{
          total,
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
          onChange: getProducts,
        }}
      />
    </Card>
  );
}
