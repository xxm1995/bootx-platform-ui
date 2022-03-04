import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/wechat/pay/page',
    method: 'GET',
    params: params
  })
}

/**
 * 单条
 */
export function get (id) {
  return axios({
    url: '/wechat/pay/findById',
    method: 'GET',
    params: { id }
  })
}
/**
 * 获取微信支持支付方式
 */
export function findPayTypeList () {
  return axios({
    url: '/wechat/pay/findPayTypeList',
    method: 'GET'
  })
}

export function add (obj) {
  return axios({
    url: '/wechat/pay/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/wechat/pay/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 获取微信支持支付方式
 */
export function findPayWayList () {
  return axios({
    url: '/wechat/pay/findPayWayList',
    method: 'GET'
  })
}

/**
 * 启用指定的微信配置
 */
export function setUpActivity (id) {
  return axios({
    url: '/wechat/pay/setUpActivity',
    method: 'POST',
    params: { id }
  })
}

/**
 * 清除指定的微信配置
 */
export function clearActivity (id) {
  return axios({
    url: '/wechat/pay/clearActivity',
    method: 'POST',
    params: { id }
  })
}

export function del (id) {
  return axios({
    url: '/wechat/pay/delete',
    method: 'DELETE',
    params: { id }
  })
}

