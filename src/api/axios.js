/*
 * 封装 Ajax 的模块：对 axios 进行封装
 * 返回是是个 promise 对象
 **/

import axios from "axios";

// 我们不能让错误直接抛出去，我们需要再内部处理掉，但返回值还得是Promise对象
export default function ajax(url, data = {}, type = "GET") {
  return new Promise((resolve) => {
    // 发异步请求，接收住返回的Promise
    let promise;
    if (type === "GET") {
      promise = axios.get(url, { params: data });
    } else {
      promise = axios.post(url, data);
    }

    promise
      .then((response) => {
        // 如果没有出错，当然要让返回的 promise 变成 resolve 状态啦
        resolve(response.data);
      })
      .catch((error) => {
        // 不能让返回的状态 变成 reject，这儿就做出错处理就好，不要改变状态
        resolve(error.message);
      });
  });
}
