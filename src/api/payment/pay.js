import { axios } from '@/utils/request'

/**
 * 取消支付(支付id)
 */
export function cancelByPaymentId (paymentId) {
  return axios({
    url: '/uni_pay/cancelByPaymentId',
    method: 'POST',
    params: { paymentId }
  })
}

/**
 * 取消支付(业务id)
 */
export function cancelByBusinessId (businessId) {
  return axios({
    url: '/uni_pay/cancelByBusinessId',
    method: 'POST',
    params: { businessId }
  })
}
/**
 * 退款(支付id)
 */
export function refundByBusinessId (businessId) {
  return axios({
    url: '/uni_pay/refundByBusinessId',
    method: 'POST',
    params: { businessId }
  })
}

/**
 * 刷新指定业务id的支付单状态
 */
export function syncByBusinessId (businessId) {
  return axios({
    url: '/uni_pay/syncByBusinessId',
    method: 'POST',
    params: { businessId }
  })
}
