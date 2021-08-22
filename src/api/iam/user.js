import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/user/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/user/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取用户拥有角色
 */
export function getRoleIds (id) {
  return axios({
    url: `/role/findRoleIdsByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加用户角色关联关系
 */
export function addUserRole (data) {
  return axios({
    url: `/role/saveAndUpdate`,
    method: 'POST',
    data: data
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/iam/permission/path/add',
    // url: `http://127.0.0.1:9005/permission/path/add`,
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/iam/permission/path/update',
    // url: `http://127.0.0.1:9005/permission/path/update`,
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/iam/permission/path/delete`,
    // url: `http://127.0.0.1:9005/permission/path/delete`,
    method: 'DELETE',
    params: { id }
  })
}
