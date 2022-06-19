import { axios } from '@/utils/request'

/**
 * 获取用户拥有部门id集合
 */
export function findDeptIdsByUser (id) {
  return axios({
    url: `/user/dept/findIdsByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取用户拥有部门集合
 */
export function getDeptList (id) {
  return axios({
    url: `/user/dept/findAllByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加用户部门关联关系
 */
export function addUserDept (data) {
  return axios({
    url: `/user/dept/saveAssign`,
    method: 'POST',
    data: data
  })
}

/**
 * 添加用户部门关联关系 批量
 */
export function addUserDeptBatch (data) {
  return axios({
    url: `/user/dept/saveAssignBatch`,
    method: 'POST',
    data: data
  })
}

/**
 * 获取用户拥有角色id集合
 */
export function getRoleIds (id) {
  return axios({
    url: `/user/role/findRoleIdsByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取用户拥有角色集合
 */
export function getRoles (id) {
  return axios({
    url: `/user/role/findRolesByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加用户角色关联关系
 */
export function addUserRole (data) {
  return axios({
    url: `/user/role/saveAssign`,
    method: 'POST',
    data: data
  })
}

/**
 * 添加用户角色关联关系 批量
 */
export function addUserRoleBatch (data) {
  return axios({
    url: `/user/role/saveAssignBatch`,
    method: 'POST',
    data: data
  })
}

/**
 * 获取用户拥有数据权限id集合
 */
export function findDataScopeIdsByUser (id) {
  return axios({
    url: `/user/data/scope/findIdsByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取用户拥有数据权限集合
 */
export function getDataScopes (id) {
  return axios({
    url: `/user/data/scope/findAllByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加用户数据权限关联关系
 */
export function addUserDataScope (data) {
  return axios({
    url: `/user/data/scope/saveAssign`,
    method: 'POST',
    data: data
  })
}

/**
 * 添加用户数据权限关联关系 批量
 */
export function addUserDataScopeBatch (data) {
  return axios({
    url: `/user/data/scope/saveAssignBatch`,
    method: 'POST',
    data: data
  })
}
