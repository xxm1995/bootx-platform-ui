/**
 * 从列表中获取指定的对象
 * @param list 列表
 * @param fieldValue 要查询的字段值
 * @param fieldName 字段名称
 */
export function findOneByField (list, fieldValue, fieldName) {
  const item = list?.filter(o => {
    return o[fieldName] === fieldValue
  })
  if (item && item.length > 0) {
    return item[0]
  } else {
    return null
  }
}

/**
 * 树形数据转换
 * @param data 数据
 * @param value
 * @param title
 * @param children 孩子列表字段名
 * @returns {*[]}
 */
export function treeDataTranslate (data, value = 'value', title = 'title', children = 'children') {
  const temp = []
  for (let i = 0; i < data.length; i++) {
    const p = {
      key: data[i][value],
      title: data[i][title],
      value: String(data[i][value])
    }
    if (data[i][children] && data[i][children].length > 0) {
      p.children = treeDataTranslate(data[i][children], value, title, children)
    }
    temp.push(p)
  }
  return temp
}

/**
 * 转换成下拉框数据格式
 * @param list 数据列表
 * @param labelName label名称
 * @param valueName 值名称
 */
export function dropdownTranslate (list, labelName, valueName) {
  return list?.map(o => {
    return {
      label: o[labelName],
      value: o[valueName]
    }
  })
}
