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
    url: `/user/role/saveAndUpdate`,
    method: 'POST',
    data: data
  })
}

/**
 * 获取用户拥有部门id集合
 */
export function getDeptIds (id) {
  return axios({
    url: `/user/dept/findDeptIdsByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取用户拥有部门集合
 */
export function getDeptList (id) {
  return axios({
    url: `/user/dept/findDeptListByUser`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加用户部门关联关系
 */
export function addUserDept (data) {
  return axios({
    url: `/user/dept/saveAndUpdate`,
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
 * 解锁用户
 */
export function unlockUser (userId) {
  return axios({
    url: '/user/admin/unlock',
    method: 'POST',
    params: { userId }
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
