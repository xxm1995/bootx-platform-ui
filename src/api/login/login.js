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
 * 获取用户菜单和资源权限
 */
export function getPermissions (clientCode) {
  return request({
    url: `/role/menu/getPermissions`,
    method: 'GET',
    params: { clientCode }
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
 * 登录后获取用户信息
 */
export function getLoginAfterUserInfo () {
  return request({
    url: `/user/getLoginAfterUserInfo`,
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

/**
 * 注册
 */
export function register (obj) {
  return request({
    url: `/user/register`,
    method: 'post',
    data: obj
  })
}

/**
 * 重置密码
 */
export function forgetPasswordByPhone (obj) {
  return request({
    url: `/user/forgetPasswordByPhone`,
    method: 'post',
    data: obj
  })
}
