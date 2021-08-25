import { axios } from '@/utils/request'

export function findIdsByRole (roleId) {
  return axios({
    url: `/role/menu/findIdsByRole`,
    method: 'GET',
    params: { roleId }
  })
}

export function save (obj) {
  return axios({
    url: `/role/menu/save`,
    method: 'POST',
    data: obj
  })
}
