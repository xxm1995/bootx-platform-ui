import { axios } from '@/utils/request'

/**
 * 树列表
 */
export function findTree () {
  return axios({
    url: '/category/findTree',
    method: 'GET'
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/category/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 判断类目是否已经存在
 */
export function existsByName (name) {
  return axios({
    url: '/category/existsByName',
    method: 'GET',
    params: { name }
  })
}

/**
 * 判断类目是否已经存在(不包含自身)
 */
export function existsByNameNotId (name, id) {
  return axios({
    url: '/category/existsByNameNotId',
    method: 'GET',
    params: { name, id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/category/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/category/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/category/delete',
    params: { id },
    method: 'DELETE'
  })
}

/**
 * 根据类目id查询关联的绑定品牌id集合
 */
export function findBindBrandIds (categoryId) {
  return axios({
    url: '/category/findBindBrandIds',
    method: 'GET',
    params: { categoryId }
  })
}

/**
 * 绑定品牌
 */
export function bindBrand (obj) {
  return axios({
    url: '/category/bindBrand',
    method: 'POST',
    data: obj
  })
}

/**
 * 根据类目id查询关联的绑定规格id集合
 */
export function findBindSpecIds (categoryId) {
  return axios({
    url: '/category/findBindSpecIds',
    method: 'GET',
    params: { categoryId }
  })
}

/**
 * 绑定规格
 */
export function bindSpec (obj) {
  return axios({
    url: '/category/bindSpec',
    method: 'POST',
    data: obj
  })
}
