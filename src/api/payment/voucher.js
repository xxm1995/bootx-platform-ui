import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/voucher/page',
    method: 'GET',
    params: params
  })
}

/**
 * 详情
 */
export function findByCardNo (cardNo) {
  return axios({
    url: '/voucher/findByCardNo',
    method: 'GET',
    params: { cardNo }
  })
}

/**
 * 锁定钱包
 */
export function lock (id) {
  return axios({
    url: '/voucher/lock',
    method: 'POST',
    params: { id }
  })
}

/**
 * 解锁钱包
 */
export function unlock (id) {
  return axios({
    url: '/voucher/unlock',
    method: 'POST',
    params: { id }
  })
}

/**
 * 批量生成储值卡
 */
export function generationBatch (obj) {
  return axios({
    url: '/voucher/generationBatch',
    method: 'POST',
    data: obj
  })
}
