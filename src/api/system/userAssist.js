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
export function sendCurrentPhoneCaptcha () {
  return axios({
    url: `/user/sendCurrentPhoneCaptcha`,
    method: 'post'
  })
}

/**
 * 校验发送更改手机验证码
 */
export function validateCurrentPhoneCaptcha (captcha) {
  return axios({
    url: `/user/validateCurrentPhoneCaptcha`,
    method: 'get',
    params: { captcha }
  })
}

/**
 * 发送更改手机号验证码
 */
export function sendPhoneCaptcha (phone) {
  return axios({
    url: `/user/sendPhoneCaptcha`,
    method: 'post',
    params: { phone }
  })
}

/**
 * 校验发送更改手机验证码
 */
export function validatePhoneCaptcha (phone, captcha) {
  return axios({
    url: `/user/validatePhoneCaptcha`,
    method: 'get',
    params: { phone, captcha }
  })
}

/**
 * 发送更改邮箱验证码
 */
export function sendCurrentEmailCaptcha () {
  return axios({
    url: `/user/sendCurrentEmailCaptcha`,
    method: 'post'
  })
}

/**
 * 验证当前用户发送更改邮箱验证码
 */
export function validateCurrentEmailCaptcha (captcha) {
  return axios({
    url: `/user/validateCurrentEmailCaptcha`,
    method: 'get',
    params: { captcha }
  })
}

/**
 * 发送更改邮箱验证码
 */
export function sendEmailCaptcha (email) {
  return axios({
    url: `/user/sendEmailCaptcha`,
    method: 'post',
    params: { email }
  })
}

/**
 * 验证更改邮箱验证码
 */
export function validateEmailCaptcha (email, captcha) {
  return axios({
    url: `/user/validateEmailCaptcha`,
    method: 'get',
    params: { email, captcha }
  })
}
