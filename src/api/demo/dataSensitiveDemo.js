import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/demo/data/sensitive/page',
    method: 'GET',
    params: params
  })
}

export function get (id) {
  return axios({
    url: '/demo/data/sensitive/findById',
    method: 'GET',
    params: { id }
  })
}

export function add (obj) {
  return axios({
    url: '/demo/data/sensitive/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/demo/data/sensitive/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/demo/data/sensitive/delete',
    params: { id },
    method: 'DELETE'
  })
}
