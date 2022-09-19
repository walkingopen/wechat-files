// 公共方法库

/**
 * 手机号校验
 * @param {手机号} phone
 * @returns
 */
export function checkPhone(phone) {
  var regex = /^((\+)?86|((\+)?86)?)0?1[23456789]\d{9}$/;
  if (phone && regex.test(phone)) {
    return true;
  }
  return false;
}

/**
 * 对手机号部分位置的信息进行替代
 * @param {手机号} phone
 * @param {起始位置从1开始} start
 * @param {截止位置} end
 * @param {替代字符} char
 */
export function phoneMask(phone, start, end, char) {
  let mask = "";
  for (let i = 0; i < phone.length; i++) {
    if (i < start - 1) {
      mask += phone[i] + "";
      continue;
    }
    if (i < end) {
      mask += char + "";
      continue;
    }
    mask += phone[i] + "";
  }

  return mask;
}

/**
 * 判断字符串是否包含数字
 * @param {校验字符串} str
 * @returns
 */
export function containsNumber(str) {
  var reg = /\d/;
  return reg.test(str);
}

/**
 * 判断字符串是否包含字母
 * @param {校验字符串} str
 * @returns
 */
export function containsChar(str) {
  var reg = /[a-z]/i;
  return reg.test(str);
}

/**
 * 判断后端接口返回的响应码是否事有效的(有效说明异常了)
 * @param {校验响应码} code
 * @returns
 */
export function checkReturnCodeValid(code) {
  return !!code && ("" + code).toUpperCase() != "SUCCESS";
}

/**
 * 字符串指定字符串替换
 * @param text 原始字符串
 * @param oldStr 旧字符串
 * @param newStr 新字符串
 * @returns
 */
export function replace(text, oldStr, newStr) {
  const reg = new RegExp(oldStr, "g");
  return text.replace(reg, newStr);
}

/**
 * 处理文本中的转义字符 -> 普通字符
 * @param str 需要转义处理的字符串
 * @returns 
 */
export function escape2Html(str: string) {
  var arrEntities = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/gi, function (all, t) {
    return arrEntities[t];
  });
}
