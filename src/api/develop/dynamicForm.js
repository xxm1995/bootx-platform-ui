import { axios } from '@/utils/request'

export function add (obj) {
  return axios({
    url: '/dynamic/form/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/dynamic/form/update',
    method: 'POST',
    data: obj
  })
}

export function page (params) {
  return axios({
    url: '/dynamic/form/page',
    method: 'GET',
    params: params
  })
}

export function list () {
  return axios({
    url: '/dynamic/form/findAll',
    method: 'GET'
  })
}

export function get (id) {
  return axios({
    url: '/dynamic/form/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode (code) {
  return axios({
    url: '/dynamic/form/existsByCode',
    method: 'GET',
    params: { code }
  })
}
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/dynamic/form/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}

export function del (id) {
  return axios({
    url: '/dynamic/form/delete',
    params: { id },
    method: 'DELETE'
  })
}
