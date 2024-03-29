import { axios } from '@/utils/request'

/**
 * 查询全部
 */
export function listByModelId (modelId) {
  return axios({
    url: '/bpm/model/node/findAllByModelId',
    method: 'GET',
    params: { modelId }
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/bpm/model/node/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/bpm/model/node/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/bpm/model/node/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/bpm/model/node/delete',
    params: { id },
    method: 'DELETE'
  })
}

/**
 * 同步
 */
export function sync (modelId) {
  return axios({
    url: '/bpm/model/node/sync',
    method: 'POST',
    params: { modelId }
  })
}

/**
 * 获取节点信息
 */
export function getNode (defId, nodeId) {
  return axios({
    url: '/bpm/model/node/findByDefIdAndTaskId',
    method: 'GET',
    params: { defId, nodeId }
  })
}

/**
 * 获取下一环节列表
 */
export function getNextNodes (defId, nodeId) {
  return axios({
    url: '/bpm/model/node/getNextNodes',
    method: 'GET',
    params: { defId, nodeId }
  })
}