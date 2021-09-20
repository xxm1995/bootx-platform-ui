import { axios } from '@/utils/request'

/**
 * 查询所有的角色
 */
export function list () {
  return axios({
    url: '/role/findAll',
    method: 'GET'
  })
}

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/role/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/role/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode (code) {
  return axios({
    url: '/role/existsByCode',
    method: 'GET',
    params: { code }
  })
}
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/role/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}

/**
 * 名称是否被使用
 */
export function existsByName (name) {
  return axios({
    url: '/role/existsByName',
    method: 'GET',
    params: { name }
  })
}
export function existsByNameNotId (name, id) {
  return axios({
    url: '/role/existsByNameNotId',
    method: 'GET',
    params: { name, id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/role/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/role/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/role/delete`,
    method: 'DELETE',
    params: { id }
  })
}
