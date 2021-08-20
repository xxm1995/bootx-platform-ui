import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/payment/channel/way/page',
    // url: `http://127.0.0.1:9502/channel/way/page`,
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/payment/channel/way/findById`,
    // url: `http://127.0.0.1:9502/channel/way/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/payment/channel/way/add',
    // url: `http://127.0.0.1:9502/channel/way/add`,
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/payment/channel/way/update',
    // url: `http://127.0.0.1:9502/channel/way/update`,
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/payment/channel/way/delete`,
    // url: `http://127.0.0.1:9005/channel/way/delete`,
    method: 'DELETE',
    params: { id }
  })
}
