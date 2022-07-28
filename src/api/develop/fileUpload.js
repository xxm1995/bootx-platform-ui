import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/file/page',
    method: 'GET',
    params: params
  })
}
