![image.png](https://cdn.nlark.com/yuque/0/2021/png/1098426/1640266837123-e6de1253-aead-419e-8935-f75593320b1f.png#clientId=uec14ad4f-24a1-4&from=paste&height=646&id=u954e02c5&margin=%5Bobject%20Object%5D&name=image.png&originHeight=861&originWidth=1325&originalType=binary&ratio=1&size=76220&status=done&style=none&taskId=u0343fdd1-5b8d-49c4-9274-d2760e3a097&width=994)
**超级查询器使用效果**
**​**

在要进行查询的页面引入超级查询器组件，并放在合适的位置上
导入语句：`import BSuperQuery from '@/components/Bootx/SuperQuery/BSuperQuery'`


```vue
<b-super-query
  :queryState="superQueryFlag"
  :fields="queryFields"
  :width="880"
  button-title="超级查询"
  model-title="超级查询器"
  @query="superQuery"
  @rest="restQuery"
/>
```


组件对应的各项参数：

- `queryState`：查询状态，当前是否在进行查询
- `fields`：查询配置参数
- `width`：宽度
- `button-title`：按钮标题
- `model-title`：弹框标题
- `@query`：点击查询时的回调
- `@rest`：点击取消查询时的回调



** **`**fields**`**查询配置参数**
示例
```javascript
[
  { field: 'num', name: '数字', type: NUMBER },
  { field: 'string', name: '字符', type: STRING },
  { field: 'bool', name: '布尔', type: BOOLEAN },
  { field: 'date', name: '日期', type: DATE },
  { field: 'time', name: '时间', type: TIME },
  { field: 'date_time', name: '日期时间', type: DATE_TIME },
  { field: 'list',
    name: '列表',
    type: LIST,
    list:
      [
        { name: '测试1', value: 'cs1' },
        { name: '测试2', value: 'cs2' },
        { name: '测试3', value: 'cs3' }
      ] }
]
```

- `field`：查询字段名，对应的数据库查询字段名称，提交时会作为查询参数传送到后台
- `name`：显示名称，查询器查询页面显示的查询字段名称，不会被提交
- `type`：数据类型，根据传入不同的的数据类型，使用不同的组件进行查询，对应后端`ParamTypeEnum` 枚举
- `underLine`：参数名称是否需要转换成下划线命名，默认转换
- `list`：type数据类型为list的时候，通过这个字段传入
  - `name`：显示名称
  - `value`：查询的值，等同`field`

**数据类型（type）**
可以引入`import BSuperQuery from '@/components/Bootx/SuperQuery/superQueryCode'`中的类型常量值进行配置，所支持的类型如下
```javascript
// 数字
export const NUMBER = 'number'
// 字符串
export const STRING = 'string'
// 布尔
export const BOOLEAN = 'boolean'
// 日期
export const DATE = 'date'
// 时间
export const TIME = 'time'
// 日期时间
export const DATE_TIME = 'date_time'
// 列表
export const LIST = 'list'
```
**@query查询回调**
```javascript
// 传入查询参数, queryParams 对应的是后端QueryParams对象
function (queryParams) {
  
}
```
**@rest取消回调**
回调函数没有参数，是个空参方法
