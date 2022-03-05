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
 * 创建聚合扫码支付
 */
export function createAggregatePay (obj) {
  return axios({
    url: '/cashier/createAggregatePay',
    method: 'POST',
    data: obj
  })
}
