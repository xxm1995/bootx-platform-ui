import { axios } from '@/utils/request'

/**
 * 登录日志
 */
export function loginPage (params) {
  return axios({
    url: '/log/login/page',
    method: 'GET',
    params: params
  })
}

export function loginInfo (id) {
  return axios({
    url: '/log/login/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 操作日志
 */
export function operatePage (params) {
  return axios({
    url: '/log/operate/page',
    method: 'GET',
    params: params
  })
}

export function operateInfo (id) {
  return axios({
    url: '/log/operate/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 数据版本日志
 */
export function dataVersionPage (params) {
  return axios({
    url: '/log/dataVersion/page',
    method: 'GET',
    params: params
  })
}

export function dataVersionInfo (id) {
  return axios({
    url: '/log/dataVersion/findById',
    method: 'GET',
    params: { id }
  })
}
