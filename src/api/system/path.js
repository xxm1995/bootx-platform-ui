import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/permission/path/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/permission/path/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取请求权限应用的角色
 */
export function getRoleIds (pathId) {
  return axios({
    url: `/role/path/findRoleIdsByPath`,
    method: 'GET',
    params: { pathId }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/permission/path/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/permission/path/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/permission/path/delete`,
    method: 'DELETE',
    params: { id }
  })
}
