import { axios } from '@/utils/request'

/**
 * 幂等演示
 */
export function idempotent (IdempotentToken) {
  return axios({
    url: '/demo/lock/idempotency',
    method: 'POST',
    params: {
      IdempotentToken
    }
  })
}
