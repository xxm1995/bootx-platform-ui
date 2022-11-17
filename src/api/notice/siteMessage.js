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
 * 发送站内信消息分页查询
 */
export function pageBySender (params) {
  return axios({
    url: '/site/message/pageBySender',
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

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/site/message/delete',
    method: 'DELETE',
    params: { id }
  })
}

/**
 * 撤回
 */
export function cancel (id) {
  return axios({
    url: '/site/message/cancel',
    method: 'POST',
    params: { id }
  })
}

/**
 * 发送
 */
export function send (id) {
  return axios({
    url: '/site/message/send',
    method: 'POST',
    params: { id }
  })
}

/**
 * 保存草稿
 */
export function saveOrUpdate (obj) {
  return axios({
    url: '/site/message/saveOrUpdate',
    method: 'POST',
    data: obj
  })
}
