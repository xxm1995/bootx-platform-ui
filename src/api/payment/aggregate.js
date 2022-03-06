import { axios } from '@/utils/request'

/**
 * 创建聚合扫码支付
 */
export function createAggregatePay (obj) {
  return axios({
    url: '/aggregate/createAggregatePay',
    method: 'POST',
    data: obj
  })
}
