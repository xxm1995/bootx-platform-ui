import { axios } from '@/utils/request'

/**
 * 分页 待处理任务
 */
export function pageByTodo (params) {
  return axios({
    url: '/bpm/admin/task/pageByTodo',
    method: 'GET',
    params: params
  })
}
/**
 * 分页 已处理任务
 */
export function pageByDone (params) {
  return axios({
    url: '/bpm/admin/task/pageByDone',
    method: 'GET',
    params: params
  })
}