import { axios } from '@/utils/request'

/**
 * 获取请求权限应用的角色
 */
export function getRoleIds (pathId) {
  return axios({
    url: `/role/path/findRoleIdsByPath`,
    method: 'GET',
    params: { pathId }
  })
}