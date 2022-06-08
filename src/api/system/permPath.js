import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/perm/path/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/perm/path/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取全部
 */
export function findAll () {
  return axios({
    url: `/perm/path/findAll`,
    method: 'GET'
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/perm/path/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/perm/path/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/perm/path/delete`,
    method: 'DELETE',
    params: { id }
  })
}

/**
 * 删除
 */
export function delBatch (ids) {
  return axios({
    url: `/perm/path/deleteBatch`,
    method: 'DELETE',
    data: ids
  })
}

/**
 * 批量更新状态
 */
export function batchUpdateEnable (obj) {
  return axios({
    url: '/perm/path/batchUpdateEnable',
    method: 'POST',
    data: obj
  })
}

/**
 * 同步
 */
export function syncSystem () {
  return axios({
    url: `/perm/path/syncSystem`,
    method: 'POST'
  })
}
