import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/payment/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/payment/findById',
    method: 'GET',
    params: { id }
  })
}

