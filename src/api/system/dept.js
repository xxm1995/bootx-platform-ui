import { axios } from '@/utils/request'

export function tree () {
  return axios({
    url: '/dept/tree',
    method: 'GET'
  })
}

export function findAll () {
  return axios({
    url: '/dept/findAll',
    method: 'GET'
  })
}

export function get (id) {
  return axios({
    url: '/dept/findById',
    params: { id },
    method: 'GET'
  })
}

export function add (obj) {
  return axios({
    url: '/dept/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/dept/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/dept/delete',
    params: { id },
    method: 'DELETE'
  })
}
