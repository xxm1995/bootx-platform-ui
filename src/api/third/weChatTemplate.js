import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/wechat/template/page',
    method: 'GET',
    params: params
  })
}

/**
 * 查询全部
 */
export function list () {
    return axios({
        url: '/wechat/template/findAll',
        method: 'GET'
    })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/wechat/template/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/wechat/template/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 编码是否被使用
 */
export function existsByCodeNotId (code, id) {
  return axios({
    url: '/wechat/template/existsByCodeNotId',
    method: 'GET',
    params: { code, id }
  })
}

/**
 * 同步
 */
export function sync () {
  return axios({
    url: `/wechat/template/sync`,
    method: 'POST'
  })
}
