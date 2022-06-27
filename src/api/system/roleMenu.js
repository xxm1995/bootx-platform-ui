import { axios } from '@/utils/request'

/**
 * 根据用户获取拥有的权限
 */
export function findPermissionIdsByRole (roleId, appCode) {
  return axios({
    url: `/role/menu/findPermissionIdsByRole`,
    method: 'GET',
    params: { roleId, appCode }
  })
}

/**
 * 获取菜单权限id集合
 */
export function findMenuIds (appCode) {
  return axios({
    url: `/role/menu/findMenuIds`,
    method: 'GET',
    params: { appCode }
  })
}

/**
 * 保存
 */
export function save (obj) {
  return axios({
    url: `/role/menu/save`,
    method: 'POST',
    data: obj
  })
}
