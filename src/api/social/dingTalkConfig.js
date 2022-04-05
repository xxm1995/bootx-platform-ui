import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/ding/config/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/ding/config/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 设置启用的配置
 */
export function setEnable (id) {
  return axios({
    url: '/ding/config/setEnable',
    method: 'POST',
    params: { id }
  })
}

/**
 * 清除启用状态
 */
export function clearEnable (id) {
  return axios({
    url: '/ding/config/clearEnable',
    method: 'POST',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/ding/config/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/ding/config/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/ding/config/delete',
    params: { id },
    method: 'DELETE'
  })
}
