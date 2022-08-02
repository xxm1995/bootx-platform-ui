import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/gen/table/page',
    method: 'GET',
    params: params
  })
}

/**
 * 获取表相关的代码生成参数信息
 */
export function getTableGenParam (tableName) {
  return axios({
    url: '/gen/table/getTableGenParam',
    method: 'GET',
    params: { tableName }
  })
}

/**
 * 预览
 */
export function codeGenPreview (obj) {
  return axios({
    url: '/gen/code/codeGenPreview',
    method: 'POST',
    data: obj
  })
}

/**
 * 下载
 */
export function genCodeZip (obj) {
  return axios({
    url: '/gen/code/genCodeZip',
    method: 'POST',
    responseType: 'blob',
    data: obj
  })
}
