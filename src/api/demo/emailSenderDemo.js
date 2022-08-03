import { axios } from '@/utils/request'

/**
 * 简单邮件发送
 */
export function sentSimpleMail (obj) {
  return axios({
    url: '/demo/notice/email/sentSimpleMail',
    method: 'POST',
    data: obj
  })
}
/**
 * 标准邮件发送
 */
export function sentMail (obj) {
  return axios({
    url: '/demo/notice/email/sentMail',
    method: 'POST',
    data: obj
  })
}
