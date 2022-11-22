<template>
  <vxe-modal
    v-model="visible"
    title="渲染测试"
    :width="modalWidth"
    :position="vxePosition"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="编号"
        >
          <a-input v-model="template.code" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="名称"
        >
          <a-input v-model="template.name" disabled/>
        </a-form-model-item>

        <a-form-model-item
          label="测试数据"
        >
          <a-textarea v-model="template.data" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="测试数据"
        >
          <a-textarea :rows="4" v-model="paramMap" allowClear placeholder="请输入json格式测试数据"/>
        </a-form-model-item>
        <a-form-model-item
          label="内容"
        >
          <a-textarea v-model="renderContent" disabled/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">渲染</a-button>
    </template>
  </vxe-modal>
</template>
<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, render } from '@/api/notice/messageTemplate'

export default {
  name: 'TemplateRender',
  mixins: [FormMixin],
  data () {
    return {
      template: {
        code: '',
        name: ''
      },
      paramMap: '',
      renderContent: ''
    }
  },
  methods: {
    init (id) {
      this.visible = true
      this.renderContent = ''
      this.template = {}
      this.confirmLoading = true
      get(id).then(({ data }) => {
        this.template = data
        this.confirmLoading = false
      })
    },
    /**
     * 渲染
     */
    handleOk () {
      let json
      try {
        json = JSON.parse(this.paramMap || '{}')
      } catch (err) {
        this.$message.error('测试数据格式不不正确，请检查是否是json格式数据')
        return
      }
      render(this.template.code, json).then(({ data }) => {
        this.renderContent = data
      })
    }
  }
}
</script>

<style scoped>

</style>
