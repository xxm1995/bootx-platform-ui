import { axios } from '@/utils/request'

export function tree () {
  return axios({
    url: '/depart/tree',
    method: 'GET'
  })
}

export function get (id) {
  return axios({
    url: '/depart/findById',
    params: { id },
    method: 'GET'
  })
}

export function add (obj) {
  return axios({
    url: '/depart/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/depart/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/depart/delete',
    params: { id },
    method: 'DELETE'
  })
}
