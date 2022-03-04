<template>
  <a-modal
    title="超级查询器"
    :width="width"
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
            <a-col :span="12">
              <a-button @click="handleAdd" type="primary">添加条件</a-button>
              <a-popconfirm
                title="是否清空所有查询条件"
                @confirm="handleReset"
                okText="是"
                cancelText="否">
                <a-button v-if="this.queryParams.length" style="margin-left: 10px;" type="danger">清空条件</a-button>
              </a-popconfirm>
            </a-col>
          </a-row>
          <super-query-item
            v-model="queryParams"
            :fields="fields"
          />
        </div>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>

import SuperQueryItem from './SuperQueryItem'
export default {
  name: 'SuperQueryModal',
  components: {
    SuperQueryItem
  },
  data () {
    return {
      visible: false,
      // 查询条件
      queryParams: [],
      // 查询字段属性
      fieldList: [],
      confirmLoading: false
    }
  },
  props: {
    // 查询字段属性
    fields: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 弹框标题
    modelTitle: {
      type: String,
      default: '超级查询器'
    },
    // 宽度
    width: {
      type: Number,
      default: 860
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
    // 关闭
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
    // 清空条件
    handleReset () {
      this.queryParams = []
    },
    // 删除
    handleDel (index) {
      this.queryParams.splice(index, 1)
    }
  },
  created () {
    this.queryParams = []
  }
}
</script>

<style scoped>

</style>
