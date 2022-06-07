import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/user/admin/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/user/admin/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/user/admin/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/user/admin/update',
    method: 'POST',
    data: obj
  })
}
/**
 * 重置密码
 */
export function restartPassword (userId, newPassword) {
  return axios({
    url: '/user/admin/restartPassword',
    method: 'POST',
    params: { userId, newPassword }
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/user/admin/delete`,
    method: 'DELETE',
    params: { id }
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
 * 锁定用户
 */
export function lockUser (userId) {
  return axios({
    url: '/user/admin/lock',
    method: 'POST',
    params: { userId }
  })
}

/**
 * 锁定用户 批量
 */
export function lockUserBatch (userIds) {
  return axios({
    url: '/user/admin/lockBatch',
    method: 'POST',
    data: userIds
  })
}

/**
 * 解锁用户
 */
export function unlockUser (userId) {
  return axios({
    url: '/user/admin/unlock',
    method: 'POST',
    params: { userId }
  })
}

/**
 * 解锁用户
 */
export function unlockUserBatch (userIds) {
  return axios({
    url: '/user/admin/unlockBatch',
    method: 'POST',
    data: userIds
  })
}

/**
 * 获取用户安全信息
 */
export function getUserSecurityInfo () {
  return axios({
    url: `/user/getUserSecurityInfo`,
    method: 'get'
  })
}

/**
 * 获取用户基础信息
 */
export function getUserBaseInfo () {
  return axios({
    url: `/user/getUserBaseInfo`,
    method: 'get'
  })
}

/**
 * 更新用户基础信息
 */
export function updateBaseInfo (data) {
  return axios({
    url: '/user/updateBaseInfo',
    method: 'POST',
    data: data
  })
}

/**
 * 修改密码
 */
export function updatePassword (password, newPassword) {
  return axios({
    url: '/user/updatePassword',
    method: 'POST',
    params: { password, newPassword }
  })
}

/* 账号是否被使用 */
export function existsUsername (username) {
  return axios({
    url: `/user/existsUsername`,
    method: 'get',
    params: { username }
  })
}
export function existsUsernameNotId (username, id) {
  return axios({
    url: `/user/existsUsernameNotId`,
    method: 'get',
    params: { username, id }
  })
}
/* 手机号是否被使用 */
export function existsPhone (phone) {
  return axios({
    url: `/user/existsPhone`,
    method: 'get',
    params: { phone }
  })
}
export function existsPhoneNotId (phone, id) {
  return axios({
    url: `/user/existsPhoneNotId`,
    method: 'get',
    params: { phone, id }
  })
}
/* 邮箱是否被使用 */
export function existsEmail (email) {
  return axios({
    url: `/user/existsEmail`,
    method: 'get',
    params: { email }
  })
}
export function existsEmailNotId (email, id) {
  return axios({
    url: `/user/existsEmailNotId`,
    method: 'get',
    params: { email, id }
  })
}
