import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/quartz/page',
    method: 'GET',
    params: params
  })
}

export function get (id) {
  return axios({
    url: '/quartz/findById',
    method: 'GET',
    params: { id }
  })
}

export function add (obj) {
  return axios({
    url: '/quartz/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/quartz/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/quartz/delete',
    params: { id },
    method: 'DELETE'
  })
}

export function start (id) {
  return axios({
    url: '/quartz/start',
    method: 'POST',
    params: { id }
  })
}

export function stop (id) {
  return axios({
    url: '/quartz/stop',
    method: 'POST',
    params: { id }
  })
}

/**
 * 立即执行
 */
export function execute (id) {
  return axios({
    url: '/quartz/execute',
    method: 'POST',
    params: { id }
  })
}

/**
 * 同步任务状态
 */
export function syncJobStatus () {
  return axios({
    url: '/quartz/syncJobStatus',
    method: 'POST'
  })
}

/**
 * 判断是否是定时任务类
 */
export function judgeJobClass (jobClassName) {
  return axios({
    url: '/quartz/judgeJobClass',
    method: 'GET',
    params: { jobClassName }
  })
}

export function logPage (params) {
  return axios({
    url: '/quartz/log/page',
    method: 'GET',
    params: params
  })
}

export function logGet (id) {
  return axios({
    url: '/quartz/log/findById',
    method: 'GET',
    params: { id }
  })
}
