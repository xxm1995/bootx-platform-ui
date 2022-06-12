import { axios } from '@/utils/request'

/**
 * 系统信息
 */
export function getSystemInfo () {
  return axios({
    url: '/monitor/system/getSystemInfo',
    method: 'get'
  })
}

/**
 * redis信息
 */
export function getRedisInfo () {
  return axios({
    url: '/monitor/system/getRedisInfo',
    method: 'get'
  })
}
