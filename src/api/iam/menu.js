import { axios } from '@/utils/request'

export function list () {
  return axios({
    // url: '/upms/permission/tree',
    url: 'http://127.0.0.1:9501/permission/tree',
    method: 'GET'
  })
}

export function get (id) {
  return axios({
    // url: '/sys/permission/info/' + id,
    url: 'http://127.0.0.1:9501/permission/info/' + id,
    method: 'GET'
  })
}

export function add (obj) {
  return axios({
    // url: '/sys/permission/save',
    url: 'http://127.0.0.1:9501/permission/save',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    // url: '/sys/permission/update',
    url: 'http://127.0.0.1:9501/permission/update',
    method: 'POST',
    data: obj
  })
}

export function delObj (id) {
  return axios({
    // url: '/sys/permission/delete/' + id,
    url: 'http://127.0.0.1:9501/permission/remove/' + id,
    method: 'DELETE'
  })
}
