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
export function getUserPermission () {
  return request({
    url: `/role/permission/findButtonPermission`,
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return request({
    url: `/token/logout`,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
export function sendSmsCode (parameter) {
  return request({
    url: `/token/account/sms`,
    method: 'post',
    data: parameter
  })
}
