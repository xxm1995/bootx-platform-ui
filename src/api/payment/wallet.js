import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/wallet/page',
    method: 'GET',
    params: params
  })
}

/**
 * 分页(未开通钱包的用户)
 */
export function pageByNotWallet (params) {
  return axios({
    url: '/wallet/pageByNotWallet',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (walletId) {
  return axios({
    url: '/wallet/findById',
    method: 'GET',
    params: { walletId }
  })
}

/**
 * 获取用户钱包
 */
export function findByUser () {
  return axios({
    url: '/wallet/findByUser',
    method: 'GET'
  })
}

/**
 * 获取钱包详情
 */
export function getWalletInfo (walletId) {
  return axios({
    url: '/wallet/getWalletInfo',
    method: 'GET',
    params: { walletId }
  })
}

/**
 * 批量开通钱包
 */
export function createWalletBatch (obj) {
  return axios({
    url: '/wallet/createWalletBatch',
    method: 'POST',
    data: obj
  })
}

/**
 * 锁定钱包
 */
export function lock (walletId) {
  return axios({
    url: '/wallet/lock',
    method: 'POST',
    params: { walletId }
  })
}

/**
 * 解锁钱包
 */
export function unlock (walletId) {
  return axios({
    url: '/wallet/unlock',
    method: 'POST',
    params: { walletId }
  })
}

/**
 * 钱包余额变动
 */
export function changerBalance (obj) {
  return axios({
    url: '/wallet/changerBalance',
    method: 'POST',
    data: obj
  })
}
