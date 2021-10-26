/*
字典工具
 */
import store from '@/store'

/**
 * 字典项转换
 */
export function dictConvert (dictCode, code) {
  const dictList = store.getters.dictList
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
 * 获取字典项列表
 */
export function getDictItems (dictCode) {
  const dictList = store.getters.dictList
  const dictItems = dictList.filter(dict => dictCode === dict.dictCode)
  // 排序号小的在前面
  return dictItems.sort((a, b) => a.sortNo - b.sortNo)
}

/**
 * 获取字典项列表(code值为数字)
 */
export function getDictItemsByNumber (dictCode) {
  const dictList = store.getters.dictList
  const dictItems = dictList.filter(dict => dictCode === dict.dictCode)
      .map(item => {
        const o = { ...item }
        o.code = Number(o.code)
        return o
      })
  // 排序号小的在前面
  return dictItems.sort((a, b) => a.sortNo - b.sortNo)
}
