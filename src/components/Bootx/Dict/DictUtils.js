/*
字典工具
 */
import store from '@/store'

/**
 * 获取字典项 (如果未获取,阻塞重新获取一下)
 */
async function getDictListAsync () {
  let dictList = store.getters.dictList
  if (!dictList.length) {
    await store.dispatch('InitDictList')
    dictList = store.getters.dictList
  }
  return dictList
}

/**
 * 获取字典项列表
 */
export function getDictItems (dictCode) {
  const dictList = store.getters.dictList
  return dictList.filter(dict => dictCode === dict.dictCode)
}

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
 * 获取字典项列表(code值为数字)
 */
export function getDictItemsByNumber (dictCode) {
  const dictList = store.getters.dictList
  return dictList.filter(dict => dictCode === dict.dictCode)
      .map(item => {
        const o = { ...item }
        o.code = Number(o.code)
        return o
      })
}

/**
 * 获取字典项列表 (异步)
 */
export async function getDictItemsAsync (dictCode) {
  const dictList = await getDictListAsync()
  return dictList.filter(dict => dictCode === dict.dictCode)
}

/**
 * 获取字典项列表(code值为数字) 异步
 */
export async function getDictItemsByNumberAsync (dictCode) {
  const dictList = await getDictListAsync()
  return dictList.filter(dict => dictCode === dict.dictCode)
    .map(item => {
      const o = { ...item }
      o.code = Number(o.code)
      return o
    })
}
