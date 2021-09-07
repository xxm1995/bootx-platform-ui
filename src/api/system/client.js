import { axios } from '@/utils/request'

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

export function page (params) {
  return axios({
    url: '/client/page',
    method: 'GET',
    params: params
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
 * 根据code获取终端信息
 */
export function findByCode (code) {
  return axios({
    url: '/client/findByCode',
    method: 'GET',
    params: { code }
  })
}
export function del (id) {
  return axios({
    url: '/client/delete',
    params: { id },
    method: 'DELETE'
  })
}
