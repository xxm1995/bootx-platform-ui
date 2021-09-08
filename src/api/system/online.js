import { axios } from '@/utils/request'

export function page (params) {
  return axios({
    url: '/user/online/page',
    method: 'GET',
    params: params
  })
}

export function findBySessionId (sessionId) {
  return axios({
    url: '/user/online/findBySessionId',
    method: 'GET',
    params: { sessionId }
  })
}

export function logoutByUserId (userId) {
  return axios({
    url: '/user/online/logoutByUserId',
    method: 'POST',
    params: { userId }
  })
}
