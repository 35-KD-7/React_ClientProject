// 得到当前时间的字符串
function padZero(s) {
  const str = s + "";
  if (str.length < 2) {
    return "0" + str;
  }
  return str;
}

export default function getDate() {
  const date = new Date();
  const YY = date.getFullYear();
  const MM = padZero(date.getMonth() + 1);
  const DD = padZero(date.getDate());

  const hh = padZero(date.getHours());
  const mm = padZero(date.getMinutes());
  const ss = padZero(date.getSeconds());

  return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}

export function dateFormat(str) {
  const date = new Date(str);
  const YY = date.getFullYear();
  const MM = padZero(date.getMonth() + 1);
  const DD = padZero(date.getDate());

  const hh = padZero(date.getHours());
  const mm = padZero(date.getMinutes());
  const ss = padZero(date.getSeconds());

  return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
}
