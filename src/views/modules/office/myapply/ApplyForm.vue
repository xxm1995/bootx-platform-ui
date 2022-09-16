<template>
  <vxe-modal
    show-zoom
    v-model="visible"
    :title="title"
    :width="modalWidth"
    :position="vxePosition"
    @close="handleClose"
  >
    <a-spin :spinning="confirmLoading">
      <!--  动态表单  -->
      <k-form-build v-if="bpmModel.formId" ref="kfb" :value="dynamicFormStatic" />
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleClose">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">确定</a-button>
      </a-space>
    </template>
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get as getModel } from '@/api/bpm/model'
import { get as getDynamicForm } from '@/api/develop/dynamicForm'
import { toStringJSON } from 'xe-utils'
import { start } from '@/api/bpm/instance'

export default {
  name: 'ApplyForm',
  mixins: [FormMixin],
  data () {
    return {
      // 表单结构
      dynamicFormStatic: {},
      // 模型
      bpmModel: {}
    }
  },
  methods: {
    async edit (id) {
      this.visible = true
      this.confirmLoading = true
      // 获取消息模板
      await getModel(id).then(res => {
        this.bpmModel = res.data
        this.title = `发起 ${this.bpmModel.name} 流程`
      })

      if (this.bpmModel.formId) {
        // 获取关联动态表单
        getDynamicForm(this.bpmModel.formId).then(res => {
          this.dynamicFormStatic = toStringJSON(res.data.value)
        })
      }
      this.confirmLoading = false
    },
    /**
     * 发起流程
     */
    async handleOk () {
      if (this.bpmModel.formId) {
        this.$refs.kfb.getData().then(dynamicForm => {
          this.confirmLoading = true
          const form = {
            modelId: this.bpmModel.id,
            name: dynamicForm?.name,
            formVariables: dynamicForm
          }
          start(form).then(() => {
            this.$emit('ok')
            this.confirmLoading = false
            this.handleClose()
          })
        }).catch(() => {
        })
      } else {
        this.confirmLoading = true
        start({ modelId: this.bpmModel.id }).then(() => {
          this.$emit('ok')
          this.confirmLoading = false
          this.handleClose()
        })
      }
    },
    /**
     * 关闭处理
     */
    handleClose () {
      if (this.bpmModel.formId) {
        this.$refs.kfb.reset()
      }
      this.bpmModel = {}
      this.dynamicFormStatic = {}
      this.handleCancel()
    }
  }
}
</script>

<style scoped>

</style>
