import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/alipay/page',
    method: 'GET',
    params: params
  })
}

/**
 * 单条
 */
export function get (id) {
  return axios({
    url: '/alipay/findById',
    method: 'GET',
    params: { id }
  })
}
/**
 * 获取支付宝支持支付方式
 */
export function findPayTypeList () {
  return axios({
    url: '/alipay/findPayTypeList',
    method: 'GET'
  })
}

export function add (obj) {
  return axios({
    url: '/alipay/add',
    method: 'POST',
    data: obj
  })
}

export function update (obj) {
  return axios({
    url: '/alipay/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 启用指定的支付宝配置
 */
export function setUpActivity (id) {
  return axios({
    url: '/alipay/setUpActivity',
    method: 'POST',
    params: { id }
  })
}

/**
 * 清除指定的支付宝配置
 */
export function clearActivity (id) {
  return axios({
    url: '/alipay/clearActivity',
    method: 'POST',
    params: { id }
  })
}

export function del (id) {
  return axios({
    url: '/alipay/delete',
    method: 'DELETE',
    params: { id }
  })
}
