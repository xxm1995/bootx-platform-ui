import { axios } from '@/utils/request'

/**
 * 获取省市二级联动
 */
export function findAllProvinceAndCity () {
  return axios({
    url: '/china/region/findAllProvinceAndCity',
    method: 'GET'
  })
}
/**
 * 获取省市区三级联动
 */
export function findAllProvinceAndCityAndArea () {
  return axios({
    url: '/china/region/findAllProvinceAndCityAndArea',
    method: 'GET'
  })
}

/**
 * 根据代码获取下一级行政区划的列表
 */
export function findAllRegionByParentCode (parentCode) {
  return axios({
    url: '/china/region/findAllRegionByParentCode',
    method: 'GET',
    params: { parentCode }
  })
}