import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/payment/channel/page',
    // url: `http://127.0.0.1:9502/channel/page`,
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/payment/channel/findById`,
    // url: `http://127.0.0.1:9502/channel/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取通道列表
 */
export function getChannels (id) {
  return axios({
    url: `/payment/channel/findAll`,
    // url: `http://127.0.0.1:9502/channel/findAll`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/payment/channel/add',
    // url: `http://127.0.0.1:9502/channel/add`,
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/payment/channel/update',
    // url: `http://127.0.0.1:9502/channel/update`,
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/payment/channel/delete`,
    // url: `http://127.0.0.1:9005/channel/delete`,
    method: 'DELETE',
    params: { id }
  })
}
