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

/**
 * 组合支付
 */
export function combinationPay (obj) {
  return axios({
    url: '/cashier/combinationPay',
    method: 'POST',
    data: obj
  })
}
