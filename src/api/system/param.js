import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/system/param/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/system/param/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取全部
 */
export function findAll () {
  return axios({
    url: `/system/param/findAll`,
    method: 'GET'
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/system/param/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/system/param/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/system/param/delete`,
    method: 'DELETE',
    params: { id }
  })
}

export function existsByKey (key) {
  return axios({
    url: '/system/param/existsByKey',
    method: 'GET',
    params: { key }
  })
}
export function existsByKeyNotId (key, id) {
  return axios({
    url: '/system/param/existsByKeyNotId',
    method: 'GET',
    params: { key, id }
  })
}
