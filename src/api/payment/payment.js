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
 * 超级查询
 */
export function superPage (params, queryParams) {
  return axios({
    url: '/payment/superPage',
    method: 'POST',
    params: params,
    data: queryParams
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

/**
 * 根据业务ID获取支付状态
 */
export function findStatusByBusinessId (businessId) {
  return axios({
    url: '/payment/findStatusByBusinessId',
    method: 'GET',
    params: { businessId }
  })
}