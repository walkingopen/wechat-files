import Taro from "@tarojs/taro"
import * as cache from "./cache"

const network_status_cache_key: string = 'networkStatus'
/**
 * 检查网络状态
 */
export function checkNetworkStatus() {
    // 监听网络状态
    Taro.onNetworkStatusChange(function(res) {
        cache.setCache(cacheKey, {
            isConnected: res.isConnected,
            networkType: res.networkType
        })
    })

    const cacheKey = network_status_cache_key
    cache.clearCache(cacheKey)
    // 查看网络状态
    const checkNetworkStatus = async () => {
        await Taro.getNetworkType({
            success: res => {
                if (res.networkType == '4g' || res.networkType == '5g' || res.networkType == 'wifi') {
                    cache.setCache(cacheKey, {
                        isConnected: true,
                        networkType: res.networkType
                    })
                } else {
                    cache.setCache(cacheKey, {
                        isConnected: false,
                        networkType: res.networkType
                    })
                }
            },
            fail: err => {
                console.error(err)
                cache.setCache(cacheKey, {
                    isConnected: false,
                    networkType: 'unknow'
                })
            }
        })
    }
    return checkNetworkStatus()
}

/**
 * 检查网络是否连接
 */
export function isConnected() {
    const status = cache.getCache(network_status_cache_key)
    return status.isConnected
}