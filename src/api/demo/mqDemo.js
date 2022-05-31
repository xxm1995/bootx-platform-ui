import { axios } from '@/utils/request'

export function sendMqttMsg (msg) {
  return axios({
    url: '/demo/mq/sendMqttMsg',
    method: 'POST',
    params: { msg }
  })
}
export function sendRabbitMsg (msg) {
  return axios({
    url: '/demo/mq/sendRabbitMsg',
    method: 'POST',
    params: { msg }
  })
}
export function sendRedisMsg (msg) {
  return axios({
    url: '/demo/mq/sendRedisMsg',
    method: 'POST',
    params: { msg }
  })
}
export function sendKeyExpired (key) {
  return axios({
    url: '/demo/mq/sendKeyExpired',
    method: 'POST',
    params: { key }
  })
}