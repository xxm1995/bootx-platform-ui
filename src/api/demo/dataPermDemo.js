import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/demo/data/perm/page',
    method: 'GET',
    params: params
  })
}

export function get (id) {
  return axios({
    url: '/demo/data/perm/findById',
    method: 'GET',
    params: { id }
  })
}

export function add (obj) {
  return axios({
    url: '/demo/data/perm/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/demo/data/perm/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/demo/data/perm/delete',
    params: { id },
    method: 'DELETE'
  })
}
