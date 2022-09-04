import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/bpm/model/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取生效并部署的主流程列表
 */
export function findMainProcess () {
  return axios({
    url: '/bpm/model/findMainProcess',
    method: 'GET'
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/bpm/model/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 根据流程定义id获取模型信息
 */
export function findByDefId (defId) {
  return axios({
    url: '/bpm/model/findByDefId',
    method: 'GET',
    params: { defId }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/bpm/model/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/bpm/model/update',
    method: 'POST',
    data: obj
  })
}
/**
 * 上传bpmn文件
 */
export function uploadBpmn (id, modelEditorXml) {
  return axios({
    url: '/bpm/model/uploadBpmn',
    method: 'POST',
    data: {
      id,
      modelEditorXml
    }
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/bpm/model/delete',
    params: { id },
    method: 'DELETE'
  })
}

/**
 * 发布
 */
export function publish (id) {
  return axios({
    url: '/bpm/model/publish',
    method: 'POST',
    params: { id }
  })
}
/**
 * 校验流程
 */
export function verifyModel (id) {
  return axios({
    url: '/bpm/model/verifyModel',
    method: 'GET',
    params: { id }
  })
}

/**
 * 复制
 */
export function copy (id) {
  return axios({
    url: '/bpm/model/copy',
    method: 'POST',
    params: { id }
  })
}
