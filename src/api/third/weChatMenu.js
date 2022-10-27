import { axios } from '@/utils/request'
/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/wechat/menu/page',
    method: 'GET',
    params: params
  })
}

/**
 * 查询全部
 */
export function list () {
  return axios({
    url: '/wechat/menu/findAll',
    method: 'GET'
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/wechat/menu/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/wechat/menu/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/wechat/menu/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/wechat/menu/delete',
    params: { id },
    method: 'DELETE'
  })
}

/**
 * 清空微信菜单
 */
export function clearMenu () {
  return axios({
    url: '/wechat/menu/clearMenu',
    method: 'POST'
  })
}

/**
 * 发布菜单
 */
export function publish (id) {
  return axios({
    url: '/wechat/menu/publish',
    method: 'POST',
    params: { id }
  })
}

/**
 * 导入微信配置的菜单
 */
export function importMenu () {
  return axios({
    url: '/wechat/menu/importMenu',
    method: 'POST'
  })
}
