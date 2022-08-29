<template>
  <vxe-modal
    fullscreen
    v-model="visible"
    :title="title"
    :esc-closable="false"
    :show-footer="false"
    :show-header="isView"
    @close="handleCancel"
  >
    <workflow-bpmn-modeler
      ref="refNode"
      :xml="modelEditorXml"
      :is-edit="isEdit"
      :is-view="isView"
      @save="save"
      @cancel="cancel"
    />
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, uploadBpmn } from '@/api/bpm/model'
import WorkflowBpmnModeler from '@/components/Bpmn'

export default {
  name: 'BpmModeler',
  mixins: [FormMixin],
  components: { WorkflowBpmnModeler },
  data () {
    return {
      // 流程定义已发布
      PUBLISHED: 'published',
      isView: false,
      isEdit: true,
      modelEditorXml: '',
      bpmModel: {}
    }
  },
  methods: {
    edit (id, isView) {
      this.isView = isView
      get(id).then(res => {
        this.bpmModel = res.data
        this.modelEditorXml = this.bpmModel.modelEditorXml
        this.isEdit = this.bpmModel.publish !== this.PUBLISHED
        this.title = `查看 ${this.bpmModel.name} 流程图`
        this.confirmLoading = false
      })
    },
    /**
     * 保存
     */
    save (data) {
      this.$confirm({
        title: '保存',
        content: '是否保存该流程图',
        onOk: async () => {
          this.confirmLoading = true
          await uploadBpmn(this.bpmModel.id, data.xml)
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
        }
      })
    },
    cancel () {
      if (this.isEdit){
        this.$confirm({
          title: '警告',
          content: '关闭后后将不对编辑的内容进行保存',
          onOk: () => {
            this.handleCancel()
          }
        })
      } else {
        this.handleCancel()
      }
    },
    handleCancel () {
      this.form = {}
      this.modelEditorXml = ''
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>
.ant-spin-nested-loading{
  height: 100%;
}
.ant-spin-container{
  height: 100%;
}
</style>
