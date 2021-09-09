import { axios } from '@/utils/request'

export function findAllItem () {
  return axios({
    url: '/dict/item/findAll',
    method: 'GET'
  })
}

export function page (params) {
  return axios({
    url: '/dict/page',
    method: 'GET',
    params: params
  })
}

export function get (id) {
  return axios({
    url: '/dict/findById',
    method: 'GET',
    params: { id }
  })
}

export function add (obj) {
  return axios({
    url: '/dict/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/dict/update',
    method: 'POST',
    data: obj
  })
}

export function del (id) {
  return axios({
    url: '/dict/deleteById',
    method: 'GET',
    params: { id }
  })
}

export function itemPage (params) {
  return axios({
    url: '/dict/item/pageByDictionaryId',
    method: 'GET',
    params: params
  })
}

export function itemGet (id) {
  return axios({
    url: '/dict/item/findById',
    method: 'GET',
    params: { id }
  })
}

export function itemAdd (obj) {
  return axios({
    url: '/dict/item/add',
    method: 'POST',
    data: obj
  })
}

export function itemUpdate (obj) {
  return axios({
    url: '/dict/item/update',
    method: 'POST',
    data: obj
  })
}

export function itemDel (id) {
  return axios({
    url: '/dict/deleteById',
    method: 'GET',
    params: { id }
  })
}
