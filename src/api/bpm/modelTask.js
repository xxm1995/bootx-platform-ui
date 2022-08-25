import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/bpm/model/task/page',
    method: 'GET',
    params: params
  })
}

/**
 * 查询全部
 */
export function listByModelId (modelId) {
  return axios({
    url: '/bpm/model/task/findAllByModelId',
    method: 'GET',
    params: { modelId }
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/bpm/model/task/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/bpm/model/task/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/bpm/model/task/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/bpm/model/task/delete',
    params: { id },
    method: 'DELETE'
  })
}

/**
 * 同步
 */
export function sync (modelId) {
  return axios({
    url: '/bpm/model/task/sync',
    method: 'POST',
    params: { modelId }
  })
}
