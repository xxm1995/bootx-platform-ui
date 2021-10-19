import { axios } from '@/utils/request'

export function loginPage (params) {
  return axios({
    url: '/log/login/page',
    method: 'GET',
    params: params
  })
}

export function operatePage (params) {
  return axios({
    url: '/log/operate/page',
    method: 'GET',
    params: params
  })
}

export function operateInfo (id) {
  return axios({
    url: '/log/operate/findById',
    method: 'GET',
    params: { id }
  })
}
