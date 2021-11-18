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
          <a-row type="flex" style="margin-bottom:10px" :gutter="16" v-for="(item, index) in queryParams" :key="index">
            <a-col :span="6">
              <a-select
                placeholder="选择查询字段"
                v-model="item.field"
                @select="(val,option)=>handleSelected(option,item)"
              >
                <a-select-option v-for="e in fieldList" :key="e.field" :value="e.field"> {{ e.name }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <a-select placeholder="选择匹配规则" v-model="item.rule">
                <a-select-option v-for="o in ruleList" :key="o.type" :value="o.type"> {{ o.name }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="6">
              <!-- 文本输入 -->
              <a-input placeholder="请输入值" v-model="item.val"/>
              <!-- 文本输入 -->

            </a-col>
            <a-col :span="6">
              <a-button @click="handleAdd" icon="plus"></a-button>&nbsp;
              <a-button v-show="queryParams.length > 1" @click="handleDel( index )" icon="minus"></a-button>
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
      queryParams: [{}],
      fieldList: [],
      confirmLoading: false,
      ruleList: [
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
    fields: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    show () {
      this.visible = true
      this.queryParams = [{}]
      this.fieldList = this.fields
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      this.$emit('ok', this.queryParams)
    },
    handleCancel () {
      this.close()
    },
    handleAdd () {
      this.queryParams.push({})
    },
    handleDel (index) {
      this.queryParams.splice(index, 1)
    },
    // 处理选择的查询字段
    handleSelected (node, item) {

    }
  }
}
</script>

<style scoped>

</style>
