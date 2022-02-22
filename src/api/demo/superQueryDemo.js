import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/demo/super/query/page',
    method: 'GET',
    params: params
  })
}

/**
 * 超级查询
 */
export function superPage (params, queryParams) {
  return axios({
    url: '/demo/super/query/superQuery',
    method: 'POST',
    params: params,
    data: queryParams
  })
}

export function get (id) {
  return axios({
    url: '/demo/super/query/findById',
    method: 'GET',
    params: { id }
  })
}

export function add (obj) {
  return axios({
    url: '/demo/super/query/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/demo/super/query/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/demo/super/query/delete',
    params: { id },
    method: 'DELETE'
  })
}
