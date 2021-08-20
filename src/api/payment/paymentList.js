import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/payment/payment/page',
    // url: `http://127.0.0.1:9502/payment/page`,
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/payment/payment/findById`,
    // url: `http://127.0.0.1:9502/payment/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/payment/payment/add',
    // url: `http://127.0.0.1:9502/payment/add`,
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/payment/payment/update',
    // url: `http://127.0.0.1:9502/payment/update`,
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/payment/payment/delete`,
    // url: `http://127.0.0.1:9005/payment/delete`,
    method: 'DELETE',
    params: { id }
  })
}
