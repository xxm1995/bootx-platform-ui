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
 * 退款
 */
export function refund (obj) {
  return axios({
    url: '/uni_pay/refund',
    method: 'POST',
    data: obj
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
