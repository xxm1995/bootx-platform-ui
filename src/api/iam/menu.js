import { axios } from '@/utils/request'

export function tree () {
  return axios({
    url: '/permission/tree',
    method: 'GET'
  })
}

export function get (id) {
  return axios({
    url: '/permission/findById',
    params: {id},
    method: 'GET'
  })
}

export function add (obj) {
  return axios({
    url: '/permission/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/permission/update',
    method: 'POST',
    data: obj
  })
}

export function delObj (id) {
  return axios({
    url: '/sys/permission/delete',
    params: {id},
    method: 'DELETE'
  })
}
