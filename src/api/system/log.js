import { axios } from '@/utils/request'

export function loginPage (params) {
  return axios({
    url: '/log/login/page',
    method: 'GET',
    params: params
  })
}
