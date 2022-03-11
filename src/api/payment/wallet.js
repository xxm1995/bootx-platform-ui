import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/wallet/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/wallet/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 锁定用户
 */
export function lock (walletId) {
  return axios({
    url: '/wallet/lock',
    method: 'POST',
    params: { walletId }
  })
}

/**
 * 解锁用户
 */
export function unlock (walletId) {
  return axios({
    url: '/wallet/unlock',
    method: 'POST',
    params: { walletId }
  })
}