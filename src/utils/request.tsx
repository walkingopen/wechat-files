import Taro from "@tarojs/taro"
import { accountApi } from "../constants/api"
import * as tool from "./tool"
import * as log from './log'
import { getAuthorization, setAuthorization } from "./cache"

/**
 * 通用后端API请求
 * @param {请求方法,GET POST} method
 * @param {接口地址} url
 * @param {请求头} header
 * @param {数据} data
 * @param {是否展示loading效果} showLoading
 * @returns 响应结果
 */
function requestS(params) {
  // 返回一个Promise
  return new Promise(function (resolve, reject) {
    const { method, url, header, data, showLoading, isMask } = params;
    if (showLoading) {
      Taro.showLoading({
        title: "",
        mask: isMask,
      });
    }
    const timestamp = parseInt((new Date().getTime() / 1000).toString());
    Taro.request({
      header: {
        ...header,
      },
      method,
      data: data,
      url: url.includes("?")
        ? url + "&t=" + timestamp
        : url + "?t=" + timestamp,
      success: function (res) {
        resolve(res);
      },
      fail: function (err) {
        Taro.showToast({
          title: "您的网络连接出现问题，请稍后重试",
          icon: "none",
        });
        reject(err);
      },
      complete: function () {
        if (showLoading) {
          Taro.hideLoading();
        }
      },
    });
  });
}

/**
 * 通用后端API请求(请求后端数据 注意带auth头)
 * @param {请求方法,GET POST} method
 * @param {接口地址} url
 * @param {请求头} header
 * @param {数据} data
 * @param {是否展示loading效果} showLoading
 * @returns 响应结果
 */
export function request(params) {
  log.info("[invoke-request]发起请求, 请求参数:{}", JSON.stringify(params));
  // 默认请求头
  const { method, url, header, data, showLoading } = params;
  const rawData = data;
  return new Promise(function (resolve, reject) {
    // 没有缓存跳转到登录页
    const { token, refreshToken } = getAuthorization();
    if (!token || !refreshToken || refreshToken == "undefined") {
      log.error("[invoke-request]请求失败,缓存中没有找到token信息");
      return;
    } else {
      var defauluHeader = {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: token,
      };
      requestS({
        method: method,
        url: url,
        header: {
          ...defauluHeader,
          ...header,
        },
        data: rawData,
        showLoading: showLoading,
      }).then((res: any) => {
        if (res.statusCode < 300) {
          // code 有值表示异常了
          if (tool.checkReturnCodeValid(res.data.code)) {
            console.log("请求失败:" + JSON.stringify(res));
            log.error("[invoke-request]请求失败,响应详情:" + JSON.stringify(res));
            reject(res.data);
          } else {
            resolve(res.data);
          }
        } else if (
          res.statusCode == 401 ||
          res.statusCode == 403 ||
          res.data.code == "TOKEN_EXPIRE"
        ) {
          console.log(`${accountApi.refreshToken}?t=${new Date().getTime()}`);
          log.error("[invoke-request]请求失败,原因是401 403, detail:{},认为token失效,尝试进行刷新token({})." + JSON.stringify(res.data), refreshToken);
          // token过期
          Taro.request({
            url: `${accountApi.refreshToken}?t=${new Date().getTime()}`,
            method: "POST",
            data: {
              refreshToken: refreshToken,
            },
            success: (res) => {
              console.log(JSON.stringify(res.data));
              if (res.statusCode == 200 && res.data.auth) {
                log.info('[invoke-requet]刷新token成功, 响应结果:{}', JSON.stringify(res.data));
                // 更新token缓存
                const newToken = `${res.data.auth.tokenType}${res.data.auth.token}`;
                setAuthorization({
                  userId: res.data.userId,
                  token: newToken,
                  refreshToken: `${res.data.auth.refreshToken}`,
                  tokenType: res.data.auth.tokenType,
                });

                // 重新带上token请求
                log.info('[invoke-requet]重新发起请求, 请求参数:{}', JSON.stringify(rawData));
                defauluHeader.Authorization = newToken;
                requestS({
                  method: method,
                  url: url,
                  header: {
                    ...defauluHeader,
                    ...header,
                  },
                  data: rawData,
                  showLoading: false,
                }).then((res: any) => {
                  resolve(res.data);
                });
              } else {
                console.log("刷新token失败:" + JSON.stringify(res.data));
                log.info('[invoke-requet]刷新token失败, 响应结果:{}', JSON.stringify(res.data));
                reject({
                 code: "TOKEN_NOT_AVAILABLE",
                 message: "token刷新失败1,请重新登录",
                })
              }
            },
            fail: (err) => {
              console.log("刷新token失败,未知异常: " + JSON.stringify(err));
              log.info('[invoke-requet]刷新token失败, 未知异常:{}', JSON.stringify(err));
              reject({
               code: "TOKEN_NOT_AVAILABLE",
               message: "token刷新失败2,请重新登录",
              })
            },
          });
        } else {
          console.log("服务端未知错误:" + JSON.stringify(res));
          log.info('[invoke-requet]请求失败,服务端未知错误.响应结果:{}', JSON.stringify(res.data));
          reject(res.data);
        }
      });
    }
  });
}

/**
 * 数据获取请求
 * @param {接口地址} url
 * @param {请求头} header
 * @param {数据} data
 * @param {是否展示loading效果} showLoading
 * @returns 响应结果
 */
export function getJson(url, header, data, showLoading) {
  return request({
    method: "GET",
    url: url,
    header: header,
    data: data,
    showLoading: showLoading,
    isMask: true,
  });
}

/**
 * 数据创建请求
 * @param {接口地址} url
 * @param {请求头} header
 * @param {数据} data
 * @param {是否展示loading效果} showLoading
 * @returns 响应结果
 */
export function postJson(url, header, data, showLoading) {
  return request({
    method: "POST",
    url: url,
    header: header,
    data: data,
    showLoading: showLoading,
    isMask: true,
  });
}

/**
 * 数据更新请求
 * @param {接口地址} url
 * @param {请求头} header
 * @param {数据} data
 * @param {是否展示loading效果} showLoading
 * @returns 响应结果
 */
export function putJson(url, header, data, showLoading) {
  return request({
    method: "PUT",
    url: url,
    header: header,
    data: data,
    showLoading: showLoading,
    isMask: true,
  });
}

/**
 * 数据更新请求
 * @param {接口地址} url
 * @param {请求头} header
 * @param {数据} data
 * @param {是否展示loading效果} showLoading
 * @returns 响应结果
 */
 export function patchJson(url, header, data, showLoading) {
  return request({
    method: "PATCH",
    url: url,
    header: header,
    data: data,
    showLoading: showLoading,
    isMask: true,
  });
}

/**
 * 上传文件请求
 * @param {接口地址} url
 * @param {请求方法} method
 * @param {请求头} header
 * @param {bytes文件数据} data
 * @returns 响应结果
 */
export function uploadFile(url, method, header, data) {
  const defaultHeader = {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": "attachment"
  }
  return new Promise((resolve, reject) => {
    Taro.request({
      url: url,
      method: method,
      header: { ...defaultHeader, header },
      data: data,
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject({
          code: "UPLOAD_FAILED_0001",
          msg: "上传失败: " + JSON.stringify(err)
        })
      }
    })
  })
}