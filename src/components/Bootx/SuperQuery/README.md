# 超级查询器使用说明


引入组件并进行声明
```import BSuperQuery from '@/components/Bootx/SuperQuery/BSuperQuery'```

```vue
<b-super-query
  :queryState="superQueryFlag"
  :fields="fields"
  @query="supperQuery"
  @rest="restQuery"
/>
传参
- fields 查询参数结构
- queryState 查询状态，true查询中，false未在查询
格式

```
fields 参数格式
```json
{
  "field": "要查询的字段名称",
  "name"
}
```

回调
- @query 触发查询 query (queryParams) 

- @rest 重置查询状态 rest()

Demo
