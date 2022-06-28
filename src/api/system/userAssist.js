import { axios } from '@/utils/request'

/**
 * 账号是否被使用
 */
export function existsUsername (username) {
  return axios({
    url: `/user/existsUsername`,
    method: 'get',
    params: { username }
  })
}
export function existsUsernameNotId (username, id) {
  return axios({
    url: `/user/existsUsernameNotId`,
    method: 'get',
    params: { username, id }
  })
}

/**
 * 手机号是否被使用
 */
export function existsPhone (phone) {
  return axios({
    url: `/user/existsPhone`,
    method: 'get',
    params: { phone }
  })
}
export function existsPhoneNotId (phone, id) {
  return axios({
    url: `/user/existsPhoneNotId`,
    method: 'get',
    params: { phone, id }
  })
}

/**
 * 邮箱是否被使用
 */
export function existsEmail (email) {
  return axios({
    url: `/user/existsEmail`,
    method: 'get',
    params: { email }
  })
}
export function existsEmailNotId (email, id) {
  return axios({
    url: `/user/existsEmailNotId`,
    method: 'get',
    params: { email, id }
  })
}

/**
 * 发送更改手机验证码
 */
export function sendCurrentPhoneChangeCaptcha () {
  return axios({
    url: `/user/sendCurrentPhoneChangeCaptcha`,
    method: 'post'
  })
}

/**
 * 校验发送更改手机验证码
 */
export function validateCurrentPhoneChangeCaptcha (captcha) {
  return axios({
    url: `/user/validateCurrentPhoneChangeCaptcha`,
    method: 'get',
    params: { captcha }
  })
}

/**
 * 发送更改手机号验证码
 */
export function sendPhoneChangeCaptcha (phone) {
  return axios({
    url: `/user/sendPhoneChangeCaptcha`,
    method: 'post',
    params: { phone }
  })
}

/**
 * 校验发送更改手机验证码
 */
export function validatePhoneChangeCaptcha (phone, captcha) {
  return axios({
    url: `/user/validatePhoneChangeCaptcha`,
    method: 'get',
    params: { phone, captcha }
  })
}

/**
 * 发送更改邮箱验证码
 */
export function sendCurrentEmailChangeCaptcha () {
  return axios({
    url: `/user/sendCurrentEmailChangeCaptcha`,
    method: 'post'
  })
}

/**
 * 验证当前用户发送更改邮箱验证码
 */
export function validateCurrentEmailChangeCaptcha (captcha) {
  return axios({
    url: `/user/validateCurrentEmailChangeCaptcha`,
    method: 'get',
    params: { captcha }
  })
}

/**
 * 发送更改邮箱验证码
 */
export function sendEmailChangeCaptcha (email) {
  return axios({
    url: `/user/sendEmailChangeCaptcha`,
    method: 'post',
    params: { email }
  })
}

/**
 * 验证更改邮箱验证码
 */
export function validateEmailChangeCaptcha (email, captcha) {
  return axios({
    url: `/user/validateEmailChangeCaptcha`,
    method: 'get',
    params: { email, captcha }
  })
}

/**
 * 发送找回密码手机验证码
 */
export function sendPhoneForgetCaptcha (phone) {
  return axios({
    url: `/user/sendPhoneForgetCaptcha`,
    method: 'post',
    params: { phone }
  })
}

/**
 * 验证找回密码手机验证码
 */
export function validatePhoneForgetCaptcha (phone, captcha) {
  return axios({
    url: `/user/validatePhoneForgetCaptcha`,
    method: 'get',
    params: { phone, captcha }
  })
}

/**
 * 根据手机验证码查询账号
 */
export function findUsernameByPhoneCaptcha (phone, captcha) {
  return axios({
    url: `/user/findUsernameByPhoneCaptcha`,
    method: 'get',
    params: { phone, captcha }
  })
}
