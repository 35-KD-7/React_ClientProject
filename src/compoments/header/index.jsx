import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { reqWeather } from "../../api";
import { Select, message } from "antd";
import { Modal } from "antd";
import dateUtils from "../../utils/dateUtils";
import { removeUser } from "../../utils/storageUtils";
import memoryUtils from "../../utils/memoryUtils";
import items from "../../config/selectConfig";
import menus from "../../config/menuConfig";

import "./index.css";

export default function Header() {
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState({});
  const url = useLocation().pathname.substring(7);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [visiable, setVisiable] = useState(0);

  function getTitle() {
    let title = "";
    menus.forEach((items) => {
      if (items.key === url) {
        title = items.label.props.children;
      } else if (items.children) {
        const cItem = items.children.find((value) => {
          return url.indexOf(value.key) === 0;
        });
        if (cItem) {
          title = cItem.label.props.children;
        }
      }
    });
    return title;
  }

  function getDate() {
    setInterval(() => {
      setDate(dateUtils());
    }, 1000);
  }

  async function getWeather(city) {
    let data = await reqWeather(city);
    if (typeof data === "string") {
      messageApi.open({
        type: "error",
        content: data,
      });
    } else {
      setWeather(data);
    }
  }

  useEffect(() => {
    // 时间的不断更新：调用定时器
    getDate();
    // 天气的更新，异步函数
    getWeather();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="header">
      {contextHolder}
      <div className=" header-top">
        欢迎：<span>{memoryUtils.user.username}</span>
        <a
          href="/#"
          onClick={(e) => {
            e.preventDefault();
            setVisiable(1);
          }}
        >
          退出
        </a>
      </div>
      <div className=" header-buttom">
        <div className="header-buttom-left">{getTitle()}</div>
        <div className="header-buttom-right">
          <span className="time">{date}</span>
          <Select
            showSearch
            defaultValue={"郑州"}
            optionFilterProp="children"
            onChange={(value) => {
              getWeather(value);
            }}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={items}
          />
          <span className="weather">
            今日天气{weather.weather} 气温{weather.temperature}摄氏度 风力
            {weather.windpower}级
          </span>
        </div>
      </div>
      <Modal
        title="退出登录"
        open={visiable === 1}
        onOk={() => {
          // 清除保存的数据
          removeUser();
          memoryUtils.user = {};
          // 跳转页面
          navigate("/");
          setVisiable(0);
        }}
        onCancel={() => {
          setVisiable(0);
        }}
      >
        {memoryUtils.user.username}确定退出吗？ 求求你在看看吧
      </Modal>
    </div>
  );
}
