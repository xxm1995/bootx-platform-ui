import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/categoryParameter/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/categoryParameter/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/categoryParameter/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/categoryParameter/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/categoryParameter/delete',
    params: { id },
    method: 'DELETE'
  })
}

export function existsByName (name, groupId) {
  return axios({
    url: '/categoryParameter/existsByName',
    method: 'GET',
    params: { name, groupId }
  })
}
export function existsByNameNotId (name, groupId, id) {
  return axios({
    url: '/categoryParameter/existsByNameNotId',
    method: 'GET',
    params: { name, groupId, id }
  })
}