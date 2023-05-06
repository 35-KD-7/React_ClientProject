/*
 * 根据接口文档定义接口请求函数
 * 包含应用中所以接口的接口的请求模块
 */
import jsonp from "jsonp";
import ajax from "./axios";
import cityMap from "../config/cityConfig";

// 不写就是现在端口所在的地址
const BaseURL = "";

// 登陆，下面的是对象的简洁写法，属性名和保存属性值的变量是一个名字
export const reqLogin = (username, password) =>
  ajax(BaseURL + "/login", { username, password }, "POST");

// 添加用户
export const reqAddOrUpdateUser = (user) =>
  ajax(BaseURL + "/manage/user/" + (user._id ? "update" : "add"), user, "POST");

// 请求天气
export const reqWeather = (city = "郑州") => {
  city = cityMap[city];
  return new Promise((resolve, reject) => {
    const url = `http://restapi.amap.com/v3/weather/weatherInfo?key=89b77db62bd77e3925d3312f1d370646&city=${city}`;
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === "1") {
        const { weather, temperature, windpower } = data.lives[0];
        resolve({ weather, temperature, windpower });
      } else {
        resolve(err.message);
      }
    });
  });
};

// 添加类别，参数用到的是对象的解构赋值
export const reqAddCategory = ({ parentId, categoryName }) =>
  ajax(BaseURL + "/manage/category/add", { parentId, categoryName }, "POST");

// 请求类别
export const reqCategory = (parentId) =>
  ajax(BaseURL + "/manage/category/list", { parentId });

// 更新类别
export const reqUpdateCategory = ({ categoryId, categoryName }) => {
  console.log(categoryId, categoryName);
  return ajax(
    BaseURL + "/manage/category/update",
    { categoryId, categoryName },
    "POST"
  );
};

// 商品的分页请求
export const reqProducts = ({ pageNum, pageSize }) =>
  ajax(BaseURL + "/manage/product/list", { pageNum, pageSize });

// 搜索商品
export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType,
}) =>
  ajax(BaseURL + "/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName,
  });

// 根据 Id 获取商品
export const reqCategoryById = (categoryId) =>
  ajax(BaseURL + "/manage/category/info", { categoryId });

// 更新商品的状态
export const reqUpdateStatus = ({ productId, status }) =>
  ajax(BaseURL + "/manage/product/updateStatus", { productId, status }, "POST");

// 根据图片名称删除图片
export const reqDeleteImg = (name) =>
  ajax(BaseURL + "/manage/img/delete", { name }, "POST");

// 添加 or 修改 商品
export const reqAddOrUpdateProduct = (product) =>
  ajax(
    BaseURL + "/manage/product/" + (product._id ? "update" : "add"),
    product,
    "POST"
  );

// 获取角色数据
export const reqRoles = () => ajax(BaseURL + "/manage/role/list");

// 添加角色
export const reqAddRole = (roleName) =>
  ajax(BaseURL + "/manage/role/add", { roleName }, "POST");

// 更新角色
export const reqUpdateRole = (role) =>
  ajax(BaseURL + "/manage/role/update", role, "POST");

// 获取所有成员数据
export const reqUsers = () => ajax(BaseURL + "/manage/user/list");

// 删除用户
export const reqDeleteUser = (userId) =>
  ajax(BaseURL + "/manage/user/delete", { userId }, "POST");
