import { axios } from '@/utils/request'

export function findIdsByRole (roleId) {
  return axios({
    url: `/role/permission/findIdsByRole`,
    method: 'GET',
    params: { roleId }
  })
}

export function save (obj) {
  return axios({
    url: `/role/permission/save`,
    method: 'POST',
    data: obj
  })
}
