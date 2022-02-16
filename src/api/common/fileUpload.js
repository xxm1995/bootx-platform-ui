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
 * 获取文件预览地址
 */
export function getFilePreviewUrl (id) {
  return request({
    url: `/file/getFilePreviewUrl`,
    method: 'get',
    params: { id }
  })
}

/**
 * 获取文件地址前缀
 */
export function getFilePreviewUrlPrefix () {
  return request({
    url: `/file/getFilePreviewUrlPrefix`,
    method: 'get'
  })
}

/**
 * 获取文件下载地址
 */
export function getFileDownloadUrl (id) {
  return request({
    url: `/file/getFileDownloadUrl`,
    method: 'get',
    params: { id }
  })
}
