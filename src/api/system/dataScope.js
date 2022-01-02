import { axios } from '@/utils/request'

/**
 * 查询所有的角色
 */
export function list () {
  return axios({
    url: '/data/scope/findAll',
    method: 'GET'
  })
}

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/data/scope/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/data/scope/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode (code) {
  return axios({
    url: '/data/scope/existsByCode',
    method: 'GET',
    params: { code }
  })
}
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/data/scope/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}

/**
 * 名称是否被使用
 */
export function existsByName (name) {
  return axios({
    url: '/data/scope/existsByName',
    method: 'GET',
    params: { name }
  })
}
export function existsByNameNotId (name, id) {
  return axios({
    url: '/data/scope/existsByNameNotId',
    method: 'GET',
    params: { name, id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/data/scope/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/data/scope/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/data/scope/delete`,
    method: 'DELETE',
    params: { id }
  })
}

/**
 * 保存关联部门
 */
export function saveDeptAssign (obj) {
  return axios({
    url: '/data/scope/saveDeptAssign',
    method: 'POST',
    data: obj
  })
}

/**
 * 获取关联部门id
 */
export function getDeptIds (id) {
  return axios({
    url: '/data/scope/getDeptIds',
    method: 'GET',
    params: { id }
  })
}
