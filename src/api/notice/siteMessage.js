import { axios } from '@/utils/request'

/**
 * 接收站内信消息分页查询
 */
export function pageByReceive (params) {
  return axios({
    url: '/site/message/pageByReceive',
    method: 'GET',
    params: params
  })
}

/**
 * 未读消息数量
 */
export function countByReceiveNotRead () {
  return axios({
    url: '/site/message/countByReceiveNotRead',
    method: 'GET'
  })
}

/**
 * 查看消息
 */
export function findById (id) {
  return axios({
    url: '/site/message/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 标记为已读
 */
export function read (id) {
  return axios({
    url: '/site/message/read',
    method: 'POST',
    params: { id }
  })
}
