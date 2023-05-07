import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  InputNumber,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { reqCategory } from "../../../api";
import PictureWall from "./pictureWall";
import RichTextEditor from "./richTextEditor";
import { reqAddOrUpdateProduct } from "../../../api";

const { Item } = Form;
const { TextArea } = Input;

export default function ProductAddUpdate() {
  // 想要获取子组件的数据
  const pictureWall = useRef(null);
  const richTextEditor = useRef(null);
  // 是添加还是更新
  const isAdd = !useLocation().state;
  const product = useLocation().state || {};
  const categorys = isAdd
    ? []
    : product.pCategoryId === "0"
    ? [product.categoryId]
    : [product.pCategoryId, product.categoryId];
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const title = (
    <span>
      <a
        href="/#"
        onClick={(e) => {
          e.preventDefault();
          navigate(-1);
        }}
      >
        <ArrowLeftOutlined style={{ color: "#3652ff", marginRight: "10px" }} />
      </a>
      <span>{isAdd ? "添加商品" : "修改商品"}</span>
    </span>
  );

  const [options, setOptions] = useState([]);

  useEffect(() => {
    async function initDate() {
      if (!isAdd) {
        // 在更新,需要加载二级列表
        const result = await Promise.all([
          getOptions("0"),
          getOptions(product.pCategoryId),
        ]);
        const targetOption = initOption(result[0]).find((value) => {
          return value.value === product.pCategoryId;
        });
        initSubOption(result[1], targetOption);
      } else {
        const result = await getOptions("0");
        initOption(result);
      }
    }
    initDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getOptions(parentId) {
    const result = await reqCategory(parentId);
    if (result.status === 0) {
      // async 函数返回的 Promise 对象, 是可以返回数据的
      return result.data;
    } else {
      messageApi.error("类别数据请求失败");
    }
  }

  function initOption(data) {
    const options = data.map((value) => {
      const { _id, name } = value;
      return { value: _id, label: name, isLeaf: false };
    });
    setOptions(options);
    return options;
  }

  function initSubOption(result, targetOption) {
    targetOption.children = result.map((value) => {
      const { _id, name } = value;
      return { value: _id, label: name, isLeaf: true };
    });
  }

  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;

    // 在发送请求查询分类
    const result = await getOptions(targetOption.value);
    targetOption.loading = false;
    if (result.length !== 0) {
      initSubOption(result, targetOption);
    } else {
      targetOption.isLeaf = true;
    }

    setOptions([...options]);
  };

  // 提交数据
  function addOrUpdateProduct() {
    // 先做一个表单验证,没有问题才可以提交数据
    form
      .validateFields()
      .then((value) => {
        // 获取表单数据
        const { name, desc, price, categorys } = value; // 还需要组件的分类 ID
        // 但是有些可能没有 两个分类
        let pCategoryId, categoryId;

        if (categorys.length === 1) {
          pCategoryId = "0";
          categoryId = categorys[0];
        } else {
          pCategoryId = categorys[0];
          categoryId = categorys[1];
        }
        // 这个是函数式组件，所有不可以直接用 ref，需要子组件包装React.forwardRef
        const imgs = pictureWall.current.getFiles();
        // 这个是类式组件，是可以直接使用 ref 的
        const detail = richTextEditor.current.getDetail();

        const productNew = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId,
        };
        if (!isAdd) {
          productNew._id = product._id;
        }

        reqAddOrUpdateProduct(productNew).then((result) => {
          if (result.status === 0) {
            messageApi.success("商品" + (isAdd ? "添加" : "更新") + "成功");
            navigate(-1);
          } else {
            messageApi.error("商品" + (isAdd ? "添加" : "更新") + "失败");
          }
        });
      })
      .catch(() => {
        console.log("验证失败");
      });
  }

  return (
    <Card title={title}>
      {contextHolder}
      <Form
        form={form}
        name="product"
        labelCol={{ span: 1.5 }} // 指定label的长度，栅格总长度是24
        wrapperCol={{ span: 8 }} // 指定文本框的长度
      >
        <Item
          name="name"
          label="商品名称"
          rules={[
            {
              required: true,
              message: "必须输入商品名称",
            },
          ]}
          initialValue={product.name}
        >
          <Input placeholder="请输入商品名称" />
        </Item>
        <Item
          name="desc"
          label="商品描述"
          rules={[
            {
              required: true,
              message: "必须输入商品描述",
            },
          ]}
          initialValue={product.desc}
        >
          <TextArea rows={2} placeholder="请输入商品描述" />
        </Item>
        <Item
          label="商品价格"
          name="price"
          rules={[
            {
              type: "number",
              required: true,
              message: "请输入数字",
            },
            {
              validator: (_, value) => {
                if (value * 1 < 0) {
                  return Promise.reject("价格必须大于0");
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
          initialValue={product.price}
        >
          <InputNumber
            addonAfter="元"
            placeholder="请输入商品价格"
            style={{ width: "100%" }}
          />
        </Item>
        <Item
          label="商品分类"
          name="categorys"
          initialValue={categorys}
          rules={[
            {
              required: true,
              message: "必须指定商品分类",
            },
          ]}
        >
          <Cascader
            options={options}
            loadData={loadData}
            placeholder="请指定商品分类"
          />
        </Item>
        <Item label="商品图片">
          <PictureWall ref={pictureWall} imgs={product.imgs} />
        </Item>
        <Item
          label="商品详情"
          labelCol={{ span: 1.5 }}
          wrapperCol={{ span: 20 }}
        >
          <RichTextEditor ref={richTextEditor} detail={product.detail} />
        </Item>
        <Item>
          <Button type="primary" onClick={addOrUpdateProduct}>
            提交
          </Button>
        </Item>
      </Form>
    </Card>
  );
}
