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