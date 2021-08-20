import { axios } from '@/utils/request'

// 扫码支付
export function qrCodePay (obj) {
  return axios({
    // url: '/sys/permission/save',
    url: 'http://127.0.0.1:9601/demo/qrCodePay',
    method: 'POST',
    data: obj
  })
}

// 条形码支付
export function barCodePay (obj) {
  return axios({
    // url: '/sys/permission/save',
    url: 'http://127.0.0.1:9601/demo/barCodePay',
    method: 'POST',
    data: obj
  })
}
