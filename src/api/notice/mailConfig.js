import { axios } from '@/utils/request'

export function add (obj) {
  return axios({
    url: '/mail/config/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/mail/config/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 设置启用的邮箱配置
 */
export function setUpActivity (id) {
  return axios({
    url: '/mail/config/setUpActivity',
    method: 'POST',
    params: { id }
  })
}

export function page (params) {
  return axios({
    url: '/mail/config/page',
    method: 'GET',
    params: params
  })
}

export function get (id) {
  return axios({
    url: '/mail/config/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode (code) {
  return axios({
    url: '/mail/config/existsByCode',
    method: 'GET',
    params: { code }
  })
}
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/mail/config/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}

export function del (id) {
  return axios({
    url: '/mail/config/delete',
    params: { id },
    method: 'DELETE'
  })
}
