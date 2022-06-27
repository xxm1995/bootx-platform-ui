import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/client/page',
    method: 'GET',
    params: params
  })
}

/**
 * 超级分页
 */
export function superPage (params, queryParams) {
  return axios({
    url: '/client/superPage',
    method: 'POST',
    params: params,
    data: queryParams
  })
}

export function get (id) {
  return axios({
    url: '/client/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 终端编码是否存在
 */
export function existsByCode (code) {
  return axios({
    url: '/client/existsByCode',
    method: 'GET',
    params: { code }
  })
}
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/client/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}

/**
 * 查询全部
 */
export function findAll () {
  return axios({
    url: '/client/findAll',
    method: 'GET'
  })
}

/**
 * 根据code获取终端信息
 */
export function findByCode (code) {
  return axios({
    url: '/client/findByCode',
    method: 'GET',
    params: { code }
  })
}

export function add (obj) {
  return axios({
    url: '/client/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/client/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/client/delete',
    params: { id },
    method: 'DELETE'
  })
}
