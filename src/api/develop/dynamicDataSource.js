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

/**
 * 测试连接
 */
export const testConnection = (obj) => {
  return axios({
    url: '/dynamic/source/testConnection',
    data: obj,
    method: 'POST'
  })
}

/**
 * 测试连接
 */
export const testConnectionById = (id) => {
  return axios({
    url: '/dynamic/source/testConnectionById',
    params: { id },
    method: 'GET'
  })
}

/**
 * 根据id进行添加到连接池中
 */
export const addDynamicDataSourceById = (id) => {
  return axios({
    url: '/dynamic/source/addDynamicDataSourceById',
    params: { id },
    method: 'POST'
  })
}

/**
 * 判断编码是否被使用
 */
export const existsByCode = (code) => {
  return axios({
    url: '/dynamic/source/existsByCode',
    params: { code },
    method: 'GET'
  })
}

/**
 * 判断编码是否被使用
 */
export const existsByCodeNotId = (code, id) => {
  return axios({
    url: '/dynamic/source/existsByCodeNotId',
    params: { code, id },
    method: 'GET'
  })
}
/**
 * 判断是否已经添加到连接池中
 */
export const existsByDataSourceKey = (code) => {
  return axios({
    url: '/dynamic/source/existsByDataSourceKey',
    params: { code },
    method: 'GET'
  })
}

/**
 * 查询当前数据源列表
 */
export const findAllDataSource = () => {
  return axios({
    url: '/dynamic/source/findAllDataSource',
    method: 'GET'
  })
}

/**
 * 从数据源列表中删除指定数据源
 */
export const removeDataSourceByKey = (key) => {
  return axios({
    url: '/dynamic/source/removeDataSourceByKey',
    params: { key },
    method: 'DELETE'
  })
}

/**
 * 数据类型列表
 */
export const databaseTypes = [
  { value: 'mysql', label: 'MySQL' },
  { value: 'oracle', label: 'Oracle' },
  { value: 'mssql', label: 'SQLServer' },
]

/**
 * 数据类型关联信息列表
 */
export // 数据列表
const databaseTypeMap = {
  mysql: {
    dbDriver: 'com.mysql.cj.jdbc.Driver',
    dbUrl:
      'jdbc:mysql://127.0.0.1:3306/bootx?characterEncoding=UTF-8&useUnicode=true&useSSL=false&tinyInt1isBit=false&allowPublicKeyRetrieval=true&serverTimezone=Asia/Shanghai',
  },
  oracle: {
    dbDriver: 'oracle.jdbc.OracleDriver',
    dbUrl: 'jdbc:oracle:thin:@127.0.0.1:1521:BOOTX',
  },
  mssql: {
    dbDriver: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    dbUrl: 'jdbc:mysql://127.0.0.1:3306/bootx?characterEncoding=UTF-8&useUnicode=true&useSSL=false',
  },
}


