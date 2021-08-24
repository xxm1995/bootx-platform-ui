import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/iam/permission/path/page',
    // url: `http://127.0.0.1:9005/permission/path/page`,
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/iam/permission/path/findById`,
    // url: `http://127.0.0.1:9005/permission/path/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取请求权限应用的角色
 */
export function getRoleIds (pathId) {
  return axios({
    url: `/iam/role/path/findRoleIdsByPath`,
    // url: `http://127.0.0.1:9005/role/path/findRoleIdsByPath`,
    method: 'GET',
    params: { pathId }
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

/**
 * 添加权限角色关联关系
 */
export function addPathRole (obj) {
  return axios({
    url: '/iam/role/path/addPathRole',
    // url: `http://127.0.0.1:9005/role/path/addPathRole`,
    method: 'POST',
    data: obj
  })
}
