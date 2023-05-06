/**
 *  封装操作 localstorage 的模块
 *  localstorage 可以将数据永久的存在浏览器内：localstorage 的值只能存字符串
 *  一般对象我们都先转成 json 格式在进行存储
 */
const USER_KEY = "user_key";
export function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  // localStorage 查询不到返回的是 null，如果不进行处理，我们null.属性就会报错
  return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}
