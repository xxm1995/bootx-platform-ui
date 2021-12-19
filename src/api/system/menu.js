import { axios } from '@/utils/request'

export function tree () {
  return axios({
    url: '/perm/menu/tree',
    method: 'GET'
  })
}

export function get (id) {
  return axios({
    url: '/perm/menu/findById',
    params: { id },
    method: 'GET'
  })
}

export function add (obj) {
  return axios({
    url: '/perm/menu/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/perm/menu/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/perm/menu/delete',
    params: { id },
    method: 'DELETE'
  })
}
