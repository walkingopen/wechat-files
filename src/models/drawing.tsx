import { modelApi, projectApi } from "../constants/api";
import * as request from "../utils/request";
import * as cache from "../utils/cache";
import { isConnected } from "../utils/network";
import Taro, { getCurrentPages } from "@tarojs/taro";

const enterprise_cache_key: string = 'enterpriseList'
const project_cache_key: string = 'projectList'
const model_cache_key: string = 'modelList'
const drawing_cache_key: string = 'drawingList'

const FS = Taro.getFileSystemManager()
const USER_PATH = Taro.env.USER_DATA_PATH

interface GetProjectListRequest {
  enterpriseId: string,
  page: number,
  pageSize: number
}
interface GetModelListRequest {
  enterpriseId: string;
  projectId: string;
  collectionId: string;
  sort: string;
  thumbnailSwitch: boolean;
  page: number;
  pageSize: number;
}
interface GetModelDrawingRequest {
  enterpriseId: string;
  projectId: string;
  collectionId: string;
  versionList: Array<string>;
}

/**
 * 模拟获取企业信息
 * @param enterpriseId 
 * @returns 
 */
export function getEnterpriseList() {
  return new Promise((resolve, reject) => {
    if (isConnected()) {
      request.getJson(projectApi.getEnterpriseList, {}, {}, true)
        .then((res: any) => {
          cache.setCache(enterprise_cache_key, res.data)
          resolve(res.data)
        }).catch(err => [
          reject(err)
        ])
    } else {
      // 离线: 从缓存中拿数据
      resolve(cache.getCache(enterprise_cache_key) || [])
    }
  })
}

/**
 * 模拟选择企业信息（缓存起来）
 * @param enterpriseId 
 * @returns 
 */
export function getSelecedEnterpriseFromCache(enterpriseId: string) {
    const entepriseList = cache.getCache(enterprise_cache_key)
    if (!entepriseList) {
      return {}
    }
    return entepriseList.filter(s => s.id == enterpriseId)
}

/**
 * 模拟获取项目信息
 * @param enterpriseId 
 * @returns 
 */
export function getProjectList(getReq: GetProjectListRequest) {
  const cacheKey = `${project_cache_key}.${getReq.enterpriseId}`
  return new Promise((resolve, reject) => {
    if (isConnected()) {
      request.getJson(projectApi.getProjectList.replace('{enterpriseId}', getReq.enterpriseId), {}, getReq, true)
        .then((res: any) => {
          cache.setCache(cacheKey, res.items)
          resolve(res.items)
        }).catch(err => {
          reject(err)
        })
    } else {
      // 离线: 从缓存中拿数据
      resolve(cache.getCache(cacheKey) || [])
    }
  })
}

/**
 * 模拟获取模型集
 * @param params 请求参数
 */
export function getModelCollectionList(params: GetModelListRequest) {
  const cacheKey = `${model_cache_key}.${params.projectId}`
  return new Promise((resolve, reject) => {
    if (isConnected()) {
      request.getJson(modelApi.getModelCollection, {}, params, true).then((res: any) => {
        cache.setCache(cacheKey, res.items)
        resolve(res.items)
      }).catch(err => {
        reject(err)
      })
    } else {
      // 离线: 从缓存中拿数据
      resolve(cache.getCache(cacheKey) || [])
    }
  })
}

/**
 * 模拟获取模型集
 * @param params 请求参数
 */
export function getModelDrawingList(params: GetModelDrawingRequest) {
  const cacheKey = `${drawing_cache_key}.${params.collectionId}`
  return new Promise((resolve, reject) => {
    if (isConnected()) {
      request.postJson(modelApi.getModelDrawing.replace('{modelId}', params.collectionId), {}, params, true).then((res: any) => {
        cache.setCache(cacheKey, res.cloudModelDrawingRespList);
        resolve(res.cloudModelDrawingRespList)
      }).catch(err => {
        reject(err)
      })
    } else {
      // 离线: 从缓存中拿数据
      resolve(cache.getCache(cacheKey) || [])
    }
  })
}

/**
 * 获取指定图纸信息
 * @param modelId 模型id
 * @param drawingId 图纸id
 */
export function getModelDrawing(modelId: string, drawingId: string) {
  const cacheKey = `${drawing_cache_key}.${modelId}`
  const modelList = cache.getCache(cacheKey) || []
  // 找到即返回
  return modelList.find((item: any) => item.id == drawingId)
}

/**
 * 获取指定图纸文件（Pdf）
 * @param modelId 模型id
 * @param drawingId 图纸id
 * @param storageFileId 文件存储id
 */
 export function getModelDrawingPdfFile(modelId: string, drawingId: string, storageFileId: string) {
  const fileDir = `${USER_PATH}/${modelId}`
  try {
    FS.accessSync(fileDir)
  } catch(err) {
    FS.mkdirSync(fileDir)
  }

  return new Promise((resolve, reject) => {
    const fileKey = `${drawingId}-${storageFileId}`
    if (isConnected()) {
      // 从线上获取图纸文件
      request.postJson(`${modelApi.getDrawingFileDownloadUrl}?collectionId=${modelId}`, {}, {appName: "web", storageFileId: storageFileId}, true)
        .then((res: any) => {
          const downloadUrl = res.downloadUrl
          Taro.downloadFile({
            url: downloadUrl.replace(/\/downloadFileName\//g, '/downloadFileName/flag-'),
            filePath: `${fileDir}/${fileKey}.pdf`,
            success: () => {
              resolve([ `${fileDir}/${fileKey}.pdf` ])
            },
            fail: err => {
              reject(err)
            }
          })
        }).catch(err => {
          reject(err)
        })
    } else {
      const files = FS.readdirSync(fileDir)
      resolve(files.filter(f => f == `${fileKey}.pdf`).map(f => `${fileDir}/${f}`))
    }
  })
}

/**
 * 获取指定图纸文件（Image）
 * @param modelId 模型id
 * @param drawingId 图纸id
 * @param storageFileId 文件存储id
 */
 export function getModelDrawingFile(modelId: string, drawingId: string, storageFileId: string) {
  const fileDir = `${USER_PATH}/${modelId}`
  try {
    FS.accessSync(fileDir)
  } catch(err) {
    FS.mkdirSync(fileDir)
  }

  // TODO: 使用一张已经转换并上传到服务器的图纸图片作为示例
  const finalModelId = '8220d024df2e474fb28129744e514009'
  const finalStorageFileId = '7bbd775eb3f243c796e27d9c4d460345' //a29bb09e619d466399c6f0338255518f
  return new Promise((resolve, reject) => {
    const fileKey = `${drawingId}-${storageFileId}`
    if (isConnected()) {
      // 从线上获取图纸文件
      request.postJson(`${modelApi.getDrawingFileDownloadUrl}?collectionId=${finalModelId}`, {}, {appName: "web", storageFileId: finalStorageFileId}, true)
        .then((res: any) => {
          const downloadUrl = res.downloadUrl
          Taro.downloadFile({
            url: downloadUrl.replace(/\/downloadFileName\//g, '/downloadFileName/flag-'),
            filePath: `${fileDir}/${fileKey}.jpg`,
            success: () => {
              resolve([ `${fileDir}/${fileKey}.jpg` ])
            },
            fail: err => {
              reject(err)
            }
          })
        }).catch(err => {
          reject(err)
        })
    } else {
      const files = FS.readdirSync(fileDir)
      resolve(files.filter(f => f == `${fileKey}.jpg`).map(f => `${fileDir}/${f}`))
    }
  })
}



/**
 * 监听网络状态并体现在标题栏上
 */
 export function navigatorBarTitleNetStatusLisener(title: string) {
  setInterval(() => {
    if (isConnected()) {
      Taro.setNavigationBarTitle({title: `(在线)${title}`})
    } else {
      Taro.setNavigationBarTitle({title: `(离线)${title}`})
    }
  }, 3000);
}
