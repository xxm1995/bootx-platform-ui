import { axios } from '@/utils/request'

/**
 * 获取图片验证码
 */
export function imgCaptcha () {
  return axios({
    url: '/captcha/imgCaptcha',
    method: 'POST'
  })
}
