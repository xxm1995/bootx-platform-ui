import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    // url: '/payment/merchant/app/page',
    url: `http://127.0.0.1:9502/merchant/app/page`,
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    // url: `/payment/merchant/app/findById`,
    url: `http://127.0.0.1:9502/merchant/app/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    // url: '/payment/merchant/app/add',
    url: `http://127.0.0.1:9502/merchant/app/add`,
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    // url: '/payment/merchant/app/update',
    url: `http://127.0.0.1:9502/merchant/app/update`,
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/payment/merchant/app/delete`,
    // url: `http://127.0.0.1:9005/merchant/app/delete`,
    method: 'DELETE',
    params: { id }
  })
}
