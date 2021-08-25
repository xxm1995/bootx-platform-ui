import { axios } from '@/utils/request'

export function tree () {
  return axios({
    url: '/permission/menu/tree',
    method: 'GET'
  })
}

export function get (id) {
  return axios({
    url: '/permission/menu/findById',
    params: { id },
    method: 'GET'
  })
}

export function add (obj) {
  return axios({
    url: '/permission/menu/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/permission/menu/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/permission/menu/delete',
    params: { id },
    method: 'DELETE'
  })
}
