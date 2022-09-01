import { axios } from '@/utils/request'

/**
 * 分页 我的待办
 */
export function pageMyTodo (params) {
  return axios({
    url: '/bpm/task/pageMyTodo',
    method: 'GET',
    params: params
  })
}

/**
 * 分页 我的已办
 */
export function pageMyDone (params) {
  return axios({
    url: '/bpm/task/pageMyDone',
    method: 'GET',
    params: params
  })
}

/**
 * 根据任务实例ID查询任务列表
 */
export function findAllByInstanceId (instanceId) {
  return axios({
    url: '/bpm/task/findAllByInstanceId',
    method: 'GET',
    params: { instanceId }
  })
}

/**
 * 通过任务
 */
export function pass (obj) {
  return axios({
    url: '/bpm/task/pass',
    method: 'POST',
    data: obj
  })
}

/**
 * 驳回任务
 */
export function reject (obj) {
  return axios({
    url: '/bpm/task/reject',
    method: 'POST',
    data: obj
  })
}

/**
 * 任务回退
 */
export function flowReturn (obj) {
  return axios({
    url: '/bpm/task/flowReturn',
    method: 'POST',
    data: obj
  })
}

/**
 * 重新分配人员
 */
export function assignee (taskId, userId) {
  return axios({
    url: '/bpm/task/assignee',
    method: 'POST',
    params: { taskId, userId }
  })
}
