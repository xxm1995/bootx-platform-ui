import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/demo/data/encrypt/page',
    method: 'GET',
    params: params
  })
}

export function get (id) {
  return axios({
    url: '/demo/data/encrypt/findById',
    method: 'GET',
    params: { id }
  })
}

export function add (obj) {
  return axios({
    url: '/demo/data/encrypt/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/demo/data/encrypt/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/demo/data/encrypt/delete',
    params: { id },
    method: 'DELETE'
  })
}
