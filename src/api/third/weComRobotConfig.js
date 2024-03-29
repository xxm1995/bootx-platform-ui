import { axios } from '@/utils/request'

export function add (obj) {
  return axios({
    url: '/wecom/robot/config/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/wecom/robot/config/update',
    method: 'POST',
    data: obj
  })
}

export function page (params) {
  return axios({
    url: '/wecom/robot/config/page',
    method: 'GET',
    params: params
  })
}

export function get (id) {
  return axios({
    url: '/wecom/robot/config/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode (code) {
  return axios({
    url: '/wecom/robot/config/existsByCode',
    method: 'GET',
    params: { code }
  })
}
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/wecom/robot/config/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}

export function del (id) {
  return axios({
    url: '/wecom/robot/config/delete',
    params: { id },
    method: 'DELETE'
  })
}
