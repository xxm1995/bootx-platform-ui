import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/application/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/application/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/application/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/application/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/application/delete',
    params: { id },
    method: 'DELETE'
  })
}

/**
 * 查询全部
 */
export function findAll () {
  return axios({
    url: '/application/findAll',
    method: 'GET'
  })
}

/**
 * 编码是否被使用
 */
export function existsByCode (code) {
  return axios({
    url: '/application/existsByCode',
    method: 'GET',
    params: { code }
  })
}
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/application/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}