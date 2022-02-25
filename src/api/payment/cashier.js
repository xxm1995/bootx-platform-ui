import { axios } from '@/utils/request'

export function pay (obj) {
  return axios({
    url: '/cashier/pay',
    method: 'POST',
    data: obj
  })
}
