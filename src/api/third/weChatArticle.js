import { axios } from '@/utils/request'

/**
 * 分页
 */
export function page (params) {
  return axios({
    url: '/wechat/article/page',
    method: 'GET',
    params: params
  })
}
