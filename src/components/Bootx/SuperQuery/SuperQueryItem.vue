<template>
  <div>
    <a-row
      type="flex"
      style="margin-top:10px"
      :gutter="16"
      v-for="(queryParam, index) in queryParams"
      :key="index">
      <a-col :span="3">
        <a-select
          v-model="queryParam.or"
        >
          <a-select-option value="false">且</a-select-option>
          <a-select-option value="true">或</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="6">
        <a-select
          placeholder="选择查询字段"
          v-model="queryParam.paramName"
          @change="(value)=>fieldChange(value,index,queryParam)"
        >
          <a-select-option v-for="o in fields" :key="o.field" :value="o.field"> {{ o.name }}</a-select-option>
        </a-select>
      </a-col>
      <a-col :span="4">
        <a-select placeholder="选择匹配规则" v-model="queryParam.compareType">
          <a-select-option v-for="o in compareTypeList" :key="o.type" :value="o.type"> {{ o.name }}</a-select-option>
        </a-select>
      </a-col>
      <!-- 查询值输入 -->
      <a-col :span="8">
        <!-- 判断条件是否是判空 -->
        <a-input disabled v-if="['is_null','not_null'].includes(queryParam.compareType)" value="空"/>
        <!-- 文本输入 -->
        <a-input v-else-if="paramTypeJudge(index,'string')" placeholder="请输入查询值" v-model="queryParam.paramValue"/>
        <!-- 字符输入 -->
        <a-input-number
          style="width: 100%"
          v-else-if="paramTypeJudge(index,'number')"
          placeholder="请输入查询值"
          v-model="queryParam.paramValue"/>
        <!-- 布尔 -->
        <a-radio-group v-else-if="paramTypeJudge(index,'boolean')" v-model="queryParam.paramValue">
          <a-radio :value="true">是</a-radio>
          <a-radio :value="false">否</a-radio>
        </a-radio-group>
        <!-- 列表 -->
        <a-select v-else-if="paramTypeJudge(index,'list')" placeholder="请选择查询值" v-model="queryParam.paramValue">
          <a-select-option v-for="o in getSelectData(index)" :key="o.value" :value="o.value"> {{ o.name }}</a-select-option>
        </a-select>
        <!-- 日期 -->
        <a-date-picker
          v-else-if="paramTypeJudge(index,'date')"
          placeholder="请选择日期"
          valueFormat="yyyy-MM-DD"
          v-model="queryParam.paramValue"/>
        <!-- 时间 -->
        <a-time-picker
          v-else-if="paramTypeJudge(index,'time')"
          placeholder="请选择时间"
          valueFormat="HH:mm:ss"
          v-model="queryParam.paramValue"/>
        <!-- 日期时间 -->
        <a-date-picker
          showTime
          v-else-if="paramTypeJudge(index,'date_time')"
          placeholder="请选择日期时间"
          valueFormat="yyyy-MM-DD HH:mm:ss"
          v-model="queryParam.paramValue"/>
        <!-- 默认文本输入 -->
        <a-input v-else placeholder="请输入查询值" v-model="queryParam.paramValue"/>
      </a-col>
      <a-col :span="3">
        <a-button @click="handleAddNested(queryParam)" icon="plus"/>&nbsp;
        <a-button @click="handleDel(index)" icon="minus"/>
      </a-col>
      <a-col v-if="queryParam.nestedParams" :span="1"/>
      <a-col v-if="queryParam.nestedParams" :span="23">
        <super-query-item :fields="fields" v-model="queryParam.nestedParams"/>
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
        { type: 'like', name: '模糊' },
        { type: 'like_left', name: '左模糊' },
        { type: 'like_right', name: '右模糊' },
        { type: 'not_like', name: 'NOT LIKE' },
        { type: 'gt', name: '大于' },
        { type: 'ge', name: '大于等于' },
        { type: 'lt', name: '小于' },
        { type: 'le', name: '小于等于' },
        { type: 'is_null', name: '为空' },
        { type: 'not_null', name: '不为空' }
      ],
      fieldTemps: []
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
      this.fieldTemps.splice(index, 1)
    },
    // 变更查询字段
    fieldChange (value, index, queryParam) {
      // 查询出对应的字段
      const field = this.fields.filter(o => o.field === value)
      if (field && field.length > 0) {
        this.$set(this.fieldTemps, index, field[0])
        this.$delete(queryParam, 'paramValue')
      }
    },
    // 输入类型切换判断
    paramTypeJudge (index, types) {
      const field = this.fieldTemps[index]
      for (const argument of arguments) {
        if (field && field.type === argument) {
          return true
        }
      }
      return false
    },
    // 获取下拉选择的数据
    getSelectData (index) {
      return this.fieldTemps[index].list || []
    }
  }
}
</script>

<style scoped>

</style>
