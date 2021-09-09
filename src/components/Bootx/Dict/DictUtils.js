/*
字典工具
 */
import store from '@/store'

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
