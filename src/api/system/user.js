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

/* 账号是否被使用 */
export function existsUsername (username) {
  return axios({
    url: `/user/existsUsername`,
    method: 'get',
    params: { username }
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
/* 邮箱是否被使用 */
export function existsEmail (email) {
  return axios({
    url: `/user/existsEmail`,
    method: 'get',
    params: { email }
  })
}
