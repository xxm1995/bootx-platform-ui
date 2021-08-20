import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/payment/notify/record/page',
    // url: `http://127.0.0.1:9502/notify/record/page`,
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/payment/notify/record/findById`,
    // url: `http://127.0.0.1:9502/notify/record/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/payment/notify/record/add',
    // url: `http://127.0.0.1:9502/notify/record/add`,
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/payment/notify/record/update',
    // url: `http://127.0.0.1:9502/notify/record/update`,
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/payment/notify/record/delete`,
    // url: `http://127.0.0.1:9005/notify/record/delete`,
    method: 'DELETE',
    params: { id }
  })
}
