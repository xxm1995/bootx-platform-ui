import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/dynamic/source/page',
    method: 'GET',
    params: params
  })
}

/**
 * 查询全部
 */
export function list () {
    return axios({
        url: '/dynamic/source/findAll',
        method: 'GET'
    })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/dynamic/source/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/dynamic/source/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/dynamic/source/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/dynamic/source/delete',
    params: { id },
    method: 'DELETE'
  })
}
