import Taro from "@tarojs/taro";

/**
 * 从缓存中获取后端认证token
 * @example
 * ```tsx
 *   const { token,refreshToken,userId,tokenType } = getAuthorization()
 * ```
 * @returns 后端认证token
 */
export function getAuthorization() {
  return getCache("authorization") || {};
}

/**
 * 添加后端认证token到缓存中
 * @param {后端返回的认证信息} auth
 * @example
 * ```tsx
 *   setAuthorization({ "token": "token", "refreshToken": "refreshToken", "userId": "userId", "tokenType": "tokenType" })
 * ```
 * @returns
 */
export function setAuthorization(auth) {
  return setCache("authorization", auth);
}

/**
 * 从缓存中清除后端认证token
 */
export function clearAuthorization() {
  return clearCache("authorization");
}

/**
 * 从缓存中获取微信身份标识密钥（codeKey）
 * @example
 * ```tsx
 *   const { codeKey } = getWechatIdentify()
 * ```
 * @returns
 */
export function getWechatIdentify() {
  return getCache("wechatIdentify") || {};
}

/**
 * 添加微信身份标识信息到缓存中（codeKey）
 * @example
 * ```tsx
 *   setWechatIdentify({ "codeKey": "codeKey" })
 * ```
 * @returns
 */
export function setWechatIdentify(identify) {
  return setCache("wechatIdentify", identify);
}

/**
 * 从缓存中清除微信身份标识信息
 */
 export function clearWechatIdentify() {
  return clearCache("wechatIdentify");
}

/**
 * 添加项目信息到缓存中
 */
export function setProjectInfo(project) {
  return setCache("projectInfo", project);
}

/**
 * 从缓存中获取项目信息
 */
export function getProjectInfo() {
  return getCache("projectInfo") || {};
}

/**
 * 从缓存中清除微项目信息
 */
export function clearProjectInfo() {
  return clearCache("projectInfo")
}

/**
 * 添加企业用户信息到缓存中
 */
export function setEnterpriseUserInfo(enterpriseUserInfo) {
  return setCache("enterpriseUserInfo", enterpriseUserInfo);
}

/**
 * 从缓存中获取企业用户信息
 */
export function getEnterpriseUserInfo() {
  return getCache("enterpriseUserInfo") || {};
}

/**
 * 从缓存中清除微企业用户信息
 */
export function clearEnterpriseUserInfo() {
  return clearCache("enterpriseUserInfo")
}



/**
 * 清除所有cache
 */
export function clearAllCache() {
  return Taro.clearStorageSync();
}

/**
 * 从缓存中获取指定key的数据
 * @param {键} key
 * @returns 后端认证token
 */
 export function getCache(key) {
  return Taro.getStorageSync(key);
}

/**
 * 添加缓存
 * @param {键} key
 * @param {值} data
 * @returns
 */
export function setCache(key, data) {
  return Taro.setStorageSync(key, data);
}

/**
 * 清除缓存
 * @param {键} key
 */
 export function clearCache(key) {
  return Taro.removeStorageSync(key);
}