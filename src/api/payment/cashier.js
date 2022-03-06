import { axios } from '@/utils/request'

/**
 * 单独支付
 */
export function singlePay (obj) {
  return axios({
    url: '/cashier/singlePay',
    method: 'POST',
    data: obj
  })
}
