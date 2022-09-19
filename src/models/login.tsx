import Taro from "@tarojs/taro";
import { accountApi } from "../constants/api";
import * as cache from "../utils/cache";
import * as tool from "../utils/tool";

/**
 * 检查是否已经登录
 * @returns {是否登录} bool
 */
export function checkLogin() {
  const { token, refreshToken } = cache.getAuthorization();

  // 已登录
  // 如果token存在则进入首页
  if (token) {
    return true;
  }

  // 已登录：但是需要刷新token
  // 如果token不存在但是 refreshToken 存在,则刷新token
  if (refreshToken) {
    return true;
  }

  // 未登录
  return false;
}

/**
 * 登录
 * @param phone 手机号
 * @param password 密码
 */
export function loginByPhone(phone: string, password: string) {
  // 清理已有缓存
  cache.clearAuthorization();
  // 登录并获取新的token
  Taro.request({
    header: {
      "Content-Type": "application/json"
    },
    url: accountApi.login,
    method: "POST",
    data: {
      loginType: "byPhone",
      identify: phone,
      password: password,
      remember: false
    },
    success(res) {
      const { statusCode, data } = res;
      console.log("[invoke-gotoLogin]手机账号登录请求, 响应:{}", JSON.stringify(res));
      if (statusCode < 300) {
        // code 有值表示异常了
        if (tool.checkReturnCodeValid(data.code)) {
          console.log("授权失败:" + JSON.stringify(res));
        } else {
          cache.setAuthorization({
            userId: data.userId,
            token: `${data.auth.tokenType}${data.auth.token}`,
            refreshToken: `${data.auth.refreshToken}`,
            tokenType: data.auth.tokenType
          });
          // 跳转到首页
          navigateToHome()
        }
      } else {
        console.log("密码错误超过限制，请稍后再试或重置密码");
      }
    },
    fail(err) {
      console.error(
        "[invoke-gotoLogin]手机账号登录请求, 网络异常, 响应:{}",
        JSON.stringify(err)
      );
    }
  }).catch(err => {
    console.error(
      "[invoke-gotoLogin]手机账号登录请求, 未知异常, 响应:{}",
      JSON.stringify(err)
    );
  });
}

/**
 * 跳转到首页
 */
export function navigateToHome() {
  // 跳转到首页
  Taro.switchTab({
    url: "/pages/drawing/index"
  });
}
