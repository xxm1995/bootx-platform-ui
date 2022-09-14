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
 * 获取流程节点的分组任务信息
 */
export function getNodeTasks (instanceId) {
  return axios({
    url: '/bpm/task/getNodeTasks',
    method: 'GET',
    params: { instanceId }
  })
}

/**
 * 任务处理
 */
export function approve (obj) {
  return axios({
    url: '/bpm/task/approve',
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
