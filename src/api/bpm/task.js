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
 * 通过任务
 */
export function pass (obj) {
  return axios({
    url: '/bpm/task/pass',
    method: 'POST',
    data: obj
  })
}
