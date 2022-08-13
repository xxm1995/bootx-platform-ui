<template>
  <a-col :md="field.md||md" :sm="24">
    <a-form-item :label="field.name">
      <!-- 文本输入 -->
      <a-input
        allowClear
        v-if="field.type === STRING"
        :placeholder="field.placeholder?field.placeholder:'请输入查询值'"
        v-model="queryParam[field.field]"/>
      <!-- 数字输入 -->
      <a-input-number
        allowClear
        style="width: 100%"
        v-else-if="field.type === NUMBER"
        :placeholder="field.placeholder?field.placeholder:'请输入查询值'"
        :precision="field.precision?field.precision:0"
        v-model="queryParam[field.field]"/>
      <!-- 布尔 -->
      <a-radio-group v-else-if="field.type === BOOLEAN" v-model="queryParam[field.field]">
        <a-radio :value="true">是</a-radio>
        <a-radio :value="false">否</a-radio>
      </a-radio-group>
      <!-- 列表 -->
      <a-select
        allowClear
        v-else-if="field.type === LIST"
        :placeholder="field.placeholder?field.placeholder:'请选择查询值'"
        v-model="queryParam[field.field]"
        :options="getSelectData(index)">
      </a-select>
      <!-- 日期 -->
      <a-date-picker
        allowClear
        v-else-if="field.type === DATE"
        style="width: 100%"
        :placeholder="field.placeholder?field.placeholder:'请选择日期'"
        :valueFormat="queryParam.format?queryParam.format:'yyyy-MM-DD'"
        v-model="queryParam[field.field]"/>
      <!-- 时间 -->
      <a-time-picker
        allowClear
        v-else-if="field.type === TIME"
        style="width: 100%"
        :placeholder="field.placeholder?field.placeholder:'请选择时间'"
        :valueFormat="queryParam.format?queryParam.format:'HH:mm:ss'"
        v-model="queryParam[field.field]"/>
      <!-- 日期时间 -->
      <a-date-picker
        allowClear
        showTime
        v-else-if="field.type === DATE_TIME"
        style="width: 100%"
        :placeholder="field.placeholder?field.placeholder:'请选择日期时间'"
        :valueFormat="queryParam.format?queryParam.format:'yyyy-MM-DD HH:mm:ss'"
        v-model="queryParam[field.field]"/>
      <!-- 默认文本输入 -->
      <a-input allowClear v-else :placeholder="field.placeholder?field.placeholder:'请输入查询值'" v-model="queryParam[field.field]"/>
    </a-form-item>
  </a-col>
</template>

<script>
import { BOOLEAN, DATE, DATE_TIME, LIST, NUMBER, STRING, TIME } from './superQueryCode'

export default {
  name: 'QueryItem',
  model: {
    // 自定义为v-model
    prop: 'queryParam',
    event: 'change'
  },
  props: {
    // 查询字段属性
    field: { type: Object, required: true },
    // 查询条件
    queryParam: { type: Object, required: true },
    // md 栅格占位
    md: { type: Number, default: 6 }
  },
  data () {
    return {
      NUMBER,
      LIST,
      BOOLEAN,
      DATE,
      DATE_TIME,
      TIME,
      STRING
    }
  },
  methods: {
    // 获取下拉选择的数据
    getSelectData () {
      return this.field.list || []
    }
  }
}
</script>

<style scoped>

</style>
