
import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/goview/admin/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取单条
 */
export function get (id) {
  return axios({
    url: '/goview/admin/findById',
    method: 'GET',
    params: { id }
  })
}

/**
 * 获取GoView的地址
 */
export function getGoViewUrl () {
  return axios({
    url: '/goview/admin/getGoViewUrl',
    method: 'GET'
  })
}

/**
 * 添加
 */
export function add (obj) {
  return axios({
    url: '/goview/admin/add',
    method: 'POST',
    data: obj
  })
}

/**
 * 更新
 */
export function update (obj) {
  return axios({
    url: '/goview/admin/update',
    method: 'POST',
    data: obj
  })
}

/**
 * 发布
 */
export function publish (id) {
  return axios({
    url: '/goview/admin/publish',
    method: 'POST',
    params: { id }
  })
}

/**
 * 取消发布
 */
export function unPublish (id) {
  return axios({
    url: '/goview/admin/unPublish',
    method: 'POST',
    params: { id }
  })
}

/**
 * 应用编辑中的信息
 */
export function enableEditContent (id) {
  return axios({
    url: '/goview/admin/enableEditContent',
    method: 'POST',
    params: { id }
  })
}

/**
 * 重置编辑中的信息
 */
export function resetEditContent (id) {
  return axios({
    url: '/goview/admin/resetEditContent',
    method: 'POST',
    params: { id }
  })
}

/**
 * 复制
 */
export function copy (id) {
  return axios({
    url: '/goview/admin/copy',
    method: 'POST',
    params: { id }
  })
}

/**
 * 删除
 */
export function del (id) {
  return axios({
    url: '/goview/admin/delete',
    params: { id },
    method: 'DELETE'
  })
}
