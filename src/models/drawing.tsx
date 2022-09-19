import { modelApi, projectApi } from "../constants/api";
import * as request from "../utils/request";
import * as cache from "../utils/cache";
import { isConnected } from "../utils/network";
import Taro from "@tarojs/taro";


const enterprise_cache_key: string = 'enterpriseList'
const project_cache_key: string = 'projectList'
const model_cache_key: string = 'modelList'
const drawing_cache_key: string = 'drawingList'

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
 * 监听网络状态并体现在标题栏上
 */
 export function navigatorBarTitleNetStatusLisener(title: string) {
  setInterval(() => {
      if (isConnected()) {
        Taro.setNavigationBarTitle({title: `${title}(在线)`})
      } else {
        Taro.setNavigationBarTitle({title: `${title}(离线)`})
      }
  }, 3000);
}
