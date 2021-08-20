import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/payment/alipay/page',
    // url: `http://127.0.0.1:9502/alipay/page`,
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/payment/alipay/findById`,
    // url: `http://127.0.0.1:9502/alipay/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/payment/alipay/delete`,
    // url: `http://127.0.0.1:9005/alipay/delete`,
    method: 'DELETE',
    params: { id }
  })
}
