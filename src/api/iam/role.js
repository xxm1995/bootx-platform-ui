import { axios } from '@/utils/request'

/**
 * 查询所有的角色
 */
export function list () {
  return axios({
    url: '/iam/role/findAll',
    method: 'GET'
  })
}

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/iam/role/page',
    // url: 'http://127.0.0.1:9005/role/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: `/iam/role/findById`,
    // url: `http://127.0.0.1:9005/role/findById`,
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/iam/role/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/iam/role/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: `/iam/role/delete`,
    method: 'DELETE',
    params: { id }
  })
}

export function roleMenuIds (roleId) {
  return axios({
    url: `/sys/role/info/menu/${roleId}`,
    method: 'GET'
  })
}

export function saveRoleMenu (menuList, roleId) {
  return axios({
    url: `/sys/role/info/menu/${roleId}`,
    method: 'POST',
    data: menuList
  })
}