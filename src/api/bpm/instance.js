import { axios } from '@/utils/request'

/**
 * 启动流程
 */
export function start (obj) {
  return axios({
    url: '/bpm/instance/start',
    method: 'POST',
    data: obj
  })
}

/**
 * 挂起实例
 */
export function suspend (instanceId) {
  return axios({
    url: '/bpm/instance/suspend',
    method: 'GET',
    params: { instanceId }
  })
}

/**
 * 激活流程
 */
export function activate (instanceId) {
  return axios({
    url: '/bpm/instance/activate',
    method: 'GET',
    params: { instanceId }
  })
}

/**
 * 分页 我的发起的流程
 */
export function pageMyApply (params) {
  return axios({
    url: '/bpm/instance/pageMyApply',
    method: 'GET',
    params: params
  })
}

/**
 * 获取流程详情
 */
export function findByInstanceId (instanceId) {
  return axios({
    url: '/bpm/instance/findByInstanceId',
    method: 'GET',
    params: { instanceId }
  })
}

/**
 * 获取流程执行的节点, 用于绘制流程图
 */
export function getFlowNodes (instanceId) {
  return axios({
    url: '/bpm/instance/getFlowNodes',
    method: 'GET',
    params: { instanceId }
  })
}

/**
 * 获取当前任务节点信息
 */
export function getCurrentNode (instanceId) {
  return axios({
    url: '/bpm/instance/getCurrentNode',
    method: 'POST',
    params: { instanceId }
  })
}

/**
 * 取消流程
 */
export function close (instanceId) {
  return axios({
    url: '/bpm/instance/close',
    method: 'POST',
    params: { instanceId }
  })
}