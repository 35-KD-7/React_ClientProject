import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, List } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { reqCategoryById } from "../../../api";
import { BASE_IMG_URL } from "../../../config/constant";

export default function ProductDetail() {
  const { name, desc, imgs, detail, price } = useLocation().state;
  const { categoryId, pCategoryId } = useLocation().state;
  const navigate = useNavigate();
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

      <span>商品详情</span>
    </span>
  );
  const [cName, setCName] = useState([]);

  useEffect(() => {
    getCategoryName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 根据 Id 获取 cName
  async function getCategoryName() {
    // 代表父亲就是一级列表
    if (pCategoryId === "0") {
      const result = await reqCategoryById(categoryId);
      setCName([result.data.name]);
    } else {
      const result = await Promise.all([
        reqCategoryById(pCategoryId),
        reqCategoryById(categoryId),
      ]);
      setCName([result[0].data.name, result[1].data.name]);
    }
  }
  return (
    <Card title={title} className="product-detail">
      <List>
        <List.Item>
          <span className="left">商品名称：</span>
          <span>{name}</span>
        </List.Item>
        <List.Item>
          <span className="left">商品描述：</span>
          <span>{desc}</span>
        </List.Item>
        <List.Item>
          <span className="left">商品价格：</span>
          <span>{price}元</span>
        </List.Item>
        <List.Item>
          <span className="left">所属分类：</span>
          <span>
            {cName[0]}
            {cName.length === 2 ? " ---> " + cName[1] : null}
          </span>
        </List.Item>
        <List.Item>
          <span className="left">商品图片：</span>
          <span>
            {imgs.map((img, index) => (
              <img
                src={BASE_IMG_URL + img}
                alt="img"
                className="product-img"
                key={index}
              />
            ))}
          </span>
        </List.Item>

        <List.Item>
          <span className="left">商品详情：</span>
          <span
            dangerouslySetInnerHTML={{
              __html: detail,
            }}
          />
        </List.Item>
      </List>
    </Card>
  );
}
