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
 * 登录
 */
export function loginOpenId (parameter) {
  return request({
    url: `/token/loginOpenId`,
    method: 'post',
    params: parameter
  })
}

/**
 * 获取用户菜单和按钮权限
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

/**
 * 获取用户信息
 */
export function getUserInfo () {
  return request({
    url: `/user/getUserInfo`,
    method: 'get'
  })
}
/**
 * 发送短信验证码
 */
export function sendSmsCode (phone) {
  return request({
    url: `/auth/sendSmsCaptcha`,
    method: 'post',
    params: { phone }
  })
}
