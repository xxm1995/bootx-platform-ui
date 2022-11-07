/*
字典工具
 */
import store from '@/store'

/**
 * 获取字典项 (如果未获取,阻塞重新获取一下)
 */
function getDictListAsync () {
  const dictList = store.getters.dictList
  console.log(dictList)
  // if (!dictList.length) {
  //   await store.dispatch('InitDictList')
  //   dictList = store.getters.dictList
  // }
  return dictList
}

/**
 * 字典项转换
 */
export function dictConvert (dictCode, code) {
  const dictList = getDictListAsync()
  const item = dictList.filter(dict => {
    return dictCode === dict.dictCode && dict.code === String(code)
  })
  if (item && item.length > 0) {
    return item[0]['name']
  } else {
    return ''
  }
}

/**
 * 获取字典项列表(code值为数字)
 */
export function getDictItemsByNumber (dictCode) {
  const dictList = getDictListAsync()
  return dictList.filter(dict => dictCode === dict.dictCode)
      .map(item => {
        const o = { ...item }
        o.code = Number(o.code)
        return o
      })
}

/**
 * 获取字典数据列表
 * 字段 name code 结构
 */
export function getDictItems (dictCode) {
  const dictList = getDictListAsync()
  return dictList.filter(dict => dictCode === dict.dictCode)
}

/**
 * 获取字典下拉框数据列表
 * 字段 label value 结构
 */
export function getDictDropDown (dictCode) {
  const list = getDictItems(dictCode)
  return list.map(o => {
    return { label: o.name, value: o.code }
  })
}

/**
 * 获取字典下拉框数据列表
 * 字段 label value 结构
 */
export function getDictDropDownNumber (dictCode) {
  const list = getDictItemsByNumber(dictCode)
  return list.map(o => {
    return { label: o.name, value: o.code }
  })
}
