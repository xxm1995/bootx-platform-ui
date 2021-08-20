import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/payment/merchant/page',
    // url: `http://127.0.0.1:9502/merchant/page`,
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/payment/merchant/findById`,
    // url: `http://127.0.0.1:9502/merchant/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取通道列表
 */
export function getmerchants (id) {
  return axios({
    url: `/payment/merchant/findById`,
    // url: `http://127.0.0.1:9502/merchant/findAll`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/payment/merchant/add',
    // url: `http://127.0.0.1:9502/merchant/add`,
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/payment/merchant/update',
    // url: `http://127.0.0.1:9502/merchant/update`,
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/payment/merchant/delete`,
    // url: `http://127.0.0.1:9005/merchant/delete`,
    method: 'DELETE',
    params: { id }
  })
}
