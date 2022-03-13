import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/wallet/log/page',
    method: 'GET',
    params: params
  })
}

/**
 * 分页
 */
export function pageByWalletId (params) {
  return axios({
    url: '/wallet/log/pageByWalletId',
    method: 'GET',
    params: params
  })
}
