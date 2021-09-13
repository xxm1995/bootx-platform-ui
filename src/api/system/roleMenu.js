import { axios } from '@/utils/request'

/**
 * 根据用户获取拥有的菜单权限
 */
export function findIdsByRole (roleId) {
  return axios({
    url: `/role/menu/findIdsByRole`,
    method: 'GET',
    params: { roleId }
  })
}

/**
 * 获取菜单权限id集合
 */
export function findMenuIds () {
  return axios({
    url: `/role/menu/findMenuIds`,
    method: 'GET'
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
