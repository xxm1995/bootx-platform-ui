import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/gen/table/page',
    method: 'GET',
    params: params
  })
}
