/**
 * Api 相关常量
 */

/**
 * process.env 为动态环境参数,在编译后将被替换为实际的环境变量指定值
 * 参数控制在 package.json / scripts 的执行指令增加 --env 参数来指定,支持dev、uat、prod等切换
 * 具体的参数定义在 config/ 对应的环境变量配置文件下配置
 */
// 账号服务域名
const API_ACCOUNT_DOMAIN = "https://account-test.api.patternx.gemdale.com";
// 项目服务域名
const API_PROJECT_DOMAIN = "https://project-test.api.patternx.gemdale.com";
// 模型服务域名
const API_MODEL_DOMAIN = "https://model-test.api.patternx.gemdale.com";
// 存储服务域名
const API_STORAGE_DOMAIN = "https://storage-test.api.patternx.gemdale.com";

/**
 * 账户相关Api定义
 */
export const accountApi = {
    login: `${API_ACCOUNT_DOMAIN}/v1/users/login`, //账号密码登录API
    wxLogin: `${API_ACCOUNT_DOMAIN}/v1/users/wx-login`, //微信授权登录API
    codeVerify: `${API_ACCOUNT_DOMAIN}/v1/users/wechat/code:verify`, // 微信登录令牌校验
    dataDecrypt: `${API_ACCOUNT_DOMAIN}/v1/users/wechat/data:decrypt`, // 解密微信加密数据
    refreshToken: `${API_ACCOUNT_DOMAIN}/v1/token:refresh`, //刷新JWT token信息
    resetPassowrd: `${API_ACCOUNT_DOMAIN}/v1/password:reset`, //重置密码
    verifyPhone: `${API_ACCOUNT_DOMAIN}/v1/registers/mobile:verify`, //验证手机是否注册
    sendSmsCode: `${API_ACCOUNT_DOMAIN}/v1/registers/sms:send`, //发送验证码
    verifySmsCode: `${API_ACCOUNT_DOMAIN}/v1/registers/sms:verify`, //验证验证码
    getUserInfo: `${API_ACCOUNT_DOMAIN}/v1/users/{userId}`, //获取用户详情
    getEnterpriseUserInfo: `${API_ACCOUNT_DOMAIN}/v1/enterpriseUser/user:enterpriseUserInfo:byphone`, //获取企业成员用户信息
    getPermission: `${API_ACCOUNT_DOMAIN}/v1/enterprise/project/permissions`, //获取用户权限
    getProjectPermissin: `${API_ACCOUNT_DOMAIN}/v1/enterprise/{entId}/project/{projectId}/permissionAction`, //获取项目权限
    getEnterprisePermission: `${API_ACCOUNT_DOMAIN}/v1/enterprise/{enterpriseId}/permissionAction`, //获取当前用户企业权限
    // 消息相关
    getMessages: `${API_ACCOUNT_DOMAIN}/v1/messages`, // 获取消息
    updateMessageLifecycleStatus: `${API_ACCOUNT_DOMAIN}/v1/messages:lifecycleStatus`, // 批量更新消息状态
    getModelProfessionalDict: `${API_ACCOUNT_DOMAIN}/v1/dicts/groups/cloud.model.professional.type?collectionId={modelId}`, //获取批注专业列表
    getProjectUsers: `${API_ACCOUNT_DOMAIN}/v1/enterprise/{enterpriseId}/project/{projectId}/users/page?collectionId={modelId}&page={page}&param=&size={size}` //获取项目下的所有用户
}

/**
 * 项目相关Api定义
 */
export const projectApi = {
  getEnterpriseList: `${API_ACCOUNT_DOMAIN}/v1/enterprises`, //获取企业列表
  getProjectList: `${API_PROJECT_DOMAIN}/v1/{enterpriseId}/projects`, //获取项目列表
}

/**
 * 模型相关Api定义
 */
export const modelApi = {
  getModelCollection: `${API_MODEL_DOMAIN}/v2/cloudm/collection/query`, // 获取模型列表
  getModelDrawing: `${API_MODEL_DOMAIN}/v1/cloudModelDrawing/drawings?collectionId={modelId}`, // 获取模型图纸列表
  getFileVersionList: `${API_MODEL_DOMAIN}/v1/cloudm/files/{drawingId}/versions?collectionId={modelId}&enterpriseId={companyId}&projectId={projectId}`, // 获取文件版本列表
  getDrawingsVersion: `${API_MODEL_DOMAIN}/v1/cloudModelDrawing/drawings/version?collectionId={modelId}&fileId={fileId}&fileVersionId={fileVersionId}`, // 根据版本获取图纸列表
  getFileDownloadUrl: `${API_MODEL_DOMAIN}/v1/file:download`, // 获取文件下载地址
  getDrawingFileDownloadUrl: `${API_MODEL_DOMAIN}/v1/cloudModelDrawing/file:download`, // 获取文件下载地址
  getAnnotationList: `${API_MODEL_DOMAIN}/v1/annotations?collectionId={modelId}&bizId={bizId}&bizType=cloud_model&isDesc={isDesc}&displayCurrent={displayCurrent}&currentLoadModel={currentLoadModel}&archive=false`, // 获取批注列表
  getAnnotationDetail: `${API_MODEL_DOMAIN}/v1/annotations/{annotationId}?collectionId={modelId}`,
  getAnnotationInfo2D: `${API_MODEL_DOMAIN}/v1/annotations/{annotationId}/info/2d?collectionId={modelId}&currentDrawingVersionId={currentDrawingVersionId}`,
  getAnnotationStatus: `${API_MODEL_DOMAIN}/v1/annotations/{annotationId}/archiveStatus`,
  addComment: `${API_MODEL_DOMAIN}/v1/annotations/{annotationId}/comments`,
  createAnnotation: `${API_MODEL_DOMAIN}/v1/annotation`,
  editAnnotation: `${API_MODEL_DOMAIN}/v1/annotation/{annotationId}`,
  getAnnotationFiles: `${API_MODEL_DOMAIN}/v1/annotations/{annotationId}/files?needFileUrl=true&fileType=`,
  getAnnotationCommentFiles: `${API_MODEL_DOMAIN}/v1/annotations/{annotationId}/comments/{commentId}/files?needFileUrl=true`,
}
/**
 * 存储相关Api定义
 */
export const storageApi = {
  presignImg: `${API_STORAGE_DOMAIN}/v1/objects/upload/presigned?collectionId={modelId}`,
  uploadImg: `${API_STORAGE_DOMAIN}/v1/objects/{fileId}/upload/complete`,
}
