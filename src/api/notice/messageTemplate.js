import { axios } from '@/utils/request'

export function add (obj) {
  return axios({
    url: '/message/template/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/message/template/update',
    method: 'POST',
    data: obj
  })
}

export function page (params) {
  return axios({
    url: '/message/template/page',
    method: 'GET',
    params: params
  })
}

export function get (id) {
  return axios({
    url: '/message/template/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode (code) {
  return axios({
    url: '/message/template/existsByCode',
    method: 'GET',
    params: { code }
  })
}
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/message/template/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}

export function del (id) {
  return axios({
    url: '/message/template/delete',
    params: { id },
    method: 'DELETE'
  })
}

/**
 * 渲染
 */
export function render (code, paramMap) {
  return axios({
    url: '/message/template/rendering',
    method: 'POST',
    params: { code },
    data: { ...paramMap }
  })
}
