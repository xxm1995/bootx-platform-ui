<template>
  <div>
    <a-row
      type="flex"
      style="margin-top:10px"
      :gutter="16"
      v-for="(item, index) in queryParams"
      :key="index">
      <a-col :span="3">
        <a-select
          v-model="item.or"
        >
          <a-select-option value="false">且</a-select-option>
          <a-select-option value="true">或</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-select
          placeholder="选择查询字段"
          v-model="item.paramName"
        >
          <a-select-option v-for="e in fields" :key="e.field" :value="e.field"> {{ e.name }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="4">
        <a-select placeholder="选择匹配规则" v-model="item.compareType">
          <a-select-option v-for="o in compareTypeList" :key="o.type" :value="o.type"> {{ o.name }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="8">
        <!-- 文本输入 -->
        <a-input placeholder="请输入值" v-model="item.paramValue"/>
        <!-- 文本输入 -->
      </a-col>
      <a-col :span="3">
        <a-button @click="handleAddNested(item)" icon="plus"/>&nbsp;
        <a-button @click="handleDel(index)" icon="minus"/>
      </a-col>
      <a-col v-if="item.nestedParams" :span="1"/>
      <a-col v-if="item.nestedParams" :span="23">
        <super-query-item :fields="fields" v-model="item.nestedParams"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'SuperQueryItem',
  model: {
    // 自定义为v-model
    prop: 'queryParams',
    event: 'change'
  },
  props: {
    // 查询字段属性
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 查询条件
    queryParams: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data () {
    return {
      // 查询类型
      compareTypeList: [
        { type: 'eq', name: '等于' },
        { type: 'ne', name: '不等于' },
        { type: 'like', name: '包含' },
        { type: 'gt', name: '大于' },
        { type: 'ge', name: '大于等于' },
        { type: 'lt', name: '小于' },
        { type: 'le', name: '小于等于' },
        { type: 'left_like', name: '包含左面' },
        { type: 'right_like', name: '包含右面' }
      ]
    }
  },
  methods: {
    // 添加子查询条件
    handleAddNested (item) {
      if (!item.nestedParams) {
        this.$set(item, 'nestedParams', [])
      }
      item.nestedParams.push({
        compareType: 'eq',
        or: 'false'
      })
    },
    // 删除
    handleDel (index) {
      this.queryParams.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
