import { axios } from '@/utils/request'

/**
 * 获取菜单
 */
export function getMenus () {
  return axios({
    url: '/wechat/menu/getMenus',
    method: 'GET'
  })
}
/**
 * 发布菜单
 */
export function publish (obj) {
  return axios({
    url: '/wechat/menu/publish',
    method: 'POST',
    data: obj
  })
}
