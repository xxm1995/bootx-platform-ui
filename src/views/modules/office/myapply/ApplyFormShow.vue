<template>
  <vxe-modal
    fullscreen
    v-model="visible"
    :title="title"
    :show-footer="false"
    @close="handleClose"
  >
    <a-tabs default-active-key="form" >
      <a-tab-pane key="form" tab="流程表单" force-render>
        <k-form-build ref="kfb" :value="dynamicFormStatic" disabled/>
      </a-tab-pane>
      <a-tab-pane key="handler" tab="任务处理" force-render>
        任务处理
      </a-tab-pane>
      <a-tab-pane key="info" tab="流程信息" force-render>
        显示流程图和流程历史
      </a-tab-pane>
    </a-tabs>
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { findByInstanceId } from '@/api/bpm/instance'
import { findByDefId } from '@/api/bpm/model'
import { get as getDynamicForm } from '@/api/develop/dynamicForm'
import { toStringJSON } from 'xe-utils'

export default {
  name: 'ApplyFormShow',
  mixins: [FormMixin],
  data () {
    return {
      // 流程id
      instanceId: '',
      // 表单结构
      dynamicFormStatic: {},
      // 流程模型
      bpmModel: {},
      // 流程实例
      instance: {}
    }
  },
  methods: {
    async edit (instanceId) {
      this.instanceId = instanceId
      // 获取流程信息
      await findByInstanceId(instanceId).then(res => {
        this.instance = res.data
        this.title = `查看 ${this.instance.instanceName} 流程`
      })
      // 获取流程模型
      await findByDefId(this.instance.defId).then(res => {
        this.bpmModel = res.data
      })

      if (this.bpmModel.formId) {
        // 获取关联动态表单
        await getDynamicForm(this.bpmModel.formId).then(res => {
          this.dynamicFormStatic = toStringJSON(res.data.value)
        })
        this.$refs.kfb.setData(this.instance.formVariables)
      }
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
