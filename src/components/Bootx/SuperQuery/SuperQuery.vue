<template>
  <a-modal
    title="高级查询构造器"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    :mask="false"
    okText="查询"
    @cancel="handleCancel"
    cancelText="关闭">
    <a-spin :spinning="confirmLoading">
      <a-form-model>
        <div>
          <a-row type="flex" style="margin-bottom:15px" :gutter="16">
            <a-col :span="6">
              <a-button @click="handleAdd" type="primary">添加条件</a-button>&nbsp;
            </a-col>
          </a-row>
          <a-row type="flex" style="margin-bottom:10px" :gutter="16" v-for="(item, index) in queryParams" :key="index">
            <a-col :span="3">
              <a-select
                v-model="item.or"
              >
                <a-select-option key="false">且</a-select-option>
                <a-select-option key="true">或</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select
                placeholder="选择查询字段"
                v-model="item.paramName"
                @select="(val,option)=>handleSelected(option,item)"
              >
                <a-select-option v-for="e in fieldList" :key="e.field" :value="e.field"> {{ e.name }}</a-select-option>
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
<!--              <a-button @click="handleAdd" icon="plus"/>&nbsp;-->
              <a-button @click="handleDel( index )" icon="minus"/>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </a-spin>
  </a-modal></template>

<script>
export default {
  name: 'SuperQueryModal',
  data () {
    return {
      visible: false,
      // 查询条件
      queryParams: [],
      // 查询字段属性
      fieldList: [],
      confirmLoading: false,
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
  props: {
    // 查询字段属性
    fields: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    // 显示
    show () {
      this.visible = true
    },
    // 关闭
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleCancel () {
      this.close()
    },
    // 确定
    handleOk () {
      this.$emit('ok', this.queryParams)
    },
    // 添加条件
    handleAdd () {
      this.queryParams.push({
        compareType: 'eq',
        or: 'false'
      })
    },
    // 添加嵌套条件
    handleAddNested () {

    },
    // 清空条件
    handleReset () {
      this.queryParams = []
    },
    // 删除
    handleDel (index) {
      this.queryParams.splice(index, 1)
    },
    // 处理选择的查询字段
    handleSelected (node, item) {

    }
  },
  created () {
    this.queryParams = []
    this.fieldList = this.fields
  }
}
</script>

<style scoped>

</style>
