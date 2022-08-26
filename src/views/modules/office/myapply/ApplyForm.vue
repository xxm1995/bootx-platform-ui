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
      <k-form-build ref="kfb" :value="dynamicFormStatic" />
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

export default {
  name: 'ApplyForm',
  mixins: [FormMixin],
  data () {
    return {
      // 表单数据
      dynamicFormStatic: {},
      // 模型
      bpmModel: {}
    }
  },
  methods: {
    async edit (id) {
      this.visible = true
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
     * 提交
     */
    async handleOk () {
      this.$refs.kfb.getData().then(dynamicForm => {
        const form = {
          modelId: this.bpmModel.id,
          name: dynamicForm.name,
          formVariables: dynamicForm
        }
        console.log(form)
      })
    },
    /**
     * 关闭处理
     */
    handleClose () {
      this.bpmModel = {}
      this.dynamicFormStatic = {}
      this.$refs.kfb.reset()
      this.handleCancel()
    }
  }
}
</script>

<style scoped>

</style>
