/**
 * 从列表中获取指定的对象
 */
export function findOneByField (list, fieldValue, fieldName) {
  const item = list.filter(o => {
    return o[fieldName] === fieldValue
  })
  if (item && item.length > 0) {
    return item[0]
  } else {
    return null
  }
}
