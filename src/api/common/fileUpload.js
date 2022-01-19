import Vue from 'vue'
import request from '@/utils/request'

/**
 * 上传
 */
export function fileUpload (formData) {
  return Vue.axios.post(
    '/file/upload',
    formData,
    {
      contentType: false,
      processData: false,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
}

/**
 * 获取文件地址
 */
export function getFileUrl (id) {
  return request({
    url: `/file/getFileUrl`,
    method: 'get',
    params: { id }
  })
}
/**
 * 获取文件地址前缀
 */
export function getFileUrlPrefix () {
  return request({
    url: `/file/getFileUrlPrefix`,
    method: 'get'
  })
}
