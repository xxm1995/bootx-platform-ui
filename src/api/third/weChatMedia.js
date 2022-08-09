import { axios } from '@/utils/request'

/**
 * 分页 非新闻素材
 */
export function pageFile (params) {
  return axios({
    url: '/wechat/media/pageFile',
    method: 'GET',
    params: params
  })
}
/**
 * 分页 新闻素材
 */
export function pageNews (params) {
  return axios({
    url: '/wechat/media/pageNews',
    method: 'GET',
    params: params
  })
}

/**
 * 删除素材
 */
export function deleteFile (mediaId) {
  return axios({
    url: '/wechat/media/deleteFile',
    method: 'GET',
    params: { mediaId }
  })
}

