import { axios } from '@/utils/request'

/**
 * 根据用户id获取角色授权(权限列表)
 */
export function findPathsByUser () {
  return axios({
    url: `/role/path/findPathsByUser`,
    method: 'GET'
  })
}

/**
 * 根据角色id获取关联权限id
 */
export function findIdsByRole (roleId) {
  return axios({
    url: `/role/path/findIdsByRole`,
    method: 'GET',
    params: { roleId }
  })
}

/**
 * 保存
 */
export function save (obj) {
  return axios({
    url: `/role/path/save`,
    method: 'POST',
    data: obj
  })
}
