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
 * 上传bpmn文件
 */
export function publish (id) {
  return axios({
    url: '/bpm/model/publish',
    method: 'POST',
    params: { id }
  })
}
