import { axios } from '@/utils/request'

export function idempotent (IdempotentToken) {
  return axios({
    url: '/demo/idempotency/test',
    method: 'POST',
    params: {
      IdempotentToken
    }
  })
}
