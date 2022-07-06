import { axios } from '@/utils/request'

export function menuTree (clientCode) {
  return axios({
    url: '/perm/menu/menuTree',
    method: 'GET',
    params: { clientCode }
  })
}

export function allTree (clientCode) {
  return axios({
    url: '/perm/menu/allTree',
    method: 'GET',
    params: { clientCode }
  })
}

export function findById (id) {
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

/**
 * 资源列表
 */
export function resourceList (menuId) {
  return axios({
    url: '/perm/menu/resourceList',
    params: { menuId },
    method: 'GET'
  })
}

/**
 * 权限码是否重复
 */
export function existsByPermCode (permCode) {
  return axios({
    url: '/perm/menu/existsByPermCode',
    params: { permCode },
    method: 'GET'
  })
}
export function existsByPermCodeNotId (permCode, id) {
  return axios({
    url: '/perm/menu/existsByPermCodeNotId',
    params: { permCode, id },
    method: 'GET'
  })
}
