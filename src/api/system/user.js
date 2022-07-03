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
 * 获取用户三方绑定信息
 */
export function getSocialBindInfo () {
  return axios({
    url: `/user/social/getSocialBindInfo`,
    method: 'get'
  })
}

/**
 * 用户绑定三方开放平台
 */
export function bindSocial (obj) {
  return axios({
    url: `/user/social/bind`,
    method: 'post',
    data: obj
  })
}
/**
 * 解除用户绑定三方开放平台
 */
export function unbindSocial (clientCode) {
  return axios({
    url: `/user/social/unbind`,
    method: 'post',
    params: { clientCode }
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

/**
 * 更新手机号
 */
export function updatePhone (obj) {
  return axios({
    url: '/user/updatePhone',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新邮箱
 */
export function updateEmail (obj) {
  return axios({
    url: '/user/updateEmail',
    method: 'POST',
    data: obj
  })
}
