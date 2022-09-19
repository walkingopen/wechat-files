/**
 * 实时日志上报
 * https://developers.weixin.qq.com/miniprogram/dev/framework/realtimelog/
 * 最终在微信后台 开发管理->运维中心->实时日志 中查看
 * 注意: 每个小程序账号每天限制1000万条日志，日志会保留7天，建议遇到问题及时定位
 */

 import Taro from '@tarojs/taro'

 var log = Taro.getRealtimeLogManager ? Taro.getRealtimeLogManager() : null
 
 export function info(...args: any[]) {
   if (!log) return
   log.info.apply(log, args)
 }
 
 export function warn(...args: any[]) {
   if (!log) return
   log.warn.apply(log, args)
 }
 
 export function error(...args: any[]) {
   if (!log) return
   log.error.apply(log, args)
 }
 
 export function setFilterMsg(msg) { // 从基础库2.7.3开始支持
   if (!log || !log.setFilterMsg) return
   if (typeof msg !== 'string') return
   log.setFilterMsg(msg)
 }
 
 export function addFilterMsg(msg) { // 从基础库2.8.1开始支持
   if (!log || !log.addFilterMsg) return
   if (typeof msg !== 'string') return
   log.addFilterMsg(msg)
 }