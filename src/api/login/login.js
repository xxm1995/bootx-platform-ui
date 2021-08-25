import request from '@/utils/request'

/**
 * 登录
 */
export function login (parameter) {
  return request({
    url: `/token/login`,
    method: 'post',
    params: parameter
  })
}

/**
 * 获取用户按钮权限
 */
export function getMenuAndButtonPermission () {
  return request({
    url: `/role/menu/findMenuAndButtonPermission`,
    method: 'GET'
  })
}

/**
 * 登出
 */
export function logout () {
  return request({
    url: `/token/logout`,
    method: 'post'
  })
}
export function sendSmsCode (parameter) {
  return request({
    url: `/token/account/sms`,
    method: 'post',
    data: parameter
  })
}
