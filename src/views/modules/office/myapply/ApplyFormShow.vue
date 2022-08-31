<template>
  <vxe-modal
    fullscreen
    v-model="visible"
    :title="title"
    :show-footer="false"
    @close="handleClose"
  >
    <a-tabs v-model="currentActiveKey" @change="handleTabChange">
      <a-tab-pane key="form" tab="流程表单" force-render>
        <k-form-build ref="kfb" :value="dynamicFormStatic" disabled/>
      </a-tab-pane>
      <a-tab-pane key="handler" tab="任务处理" force-render>
        任务处理
      </a-tab-pane>
      <a-tab-pane key="history" tab="历史信息" force-render>
        显示和流程历史
      </a-tab-pane>
      <a-tab-pane key="flowChart" tab="流程图" force-render>
        <process-viewer ref="processViewer" :height="750" :flow-node-list="flowNodeList" :xml="bpmModel.modelEditorXml"/>
      </a-tab-pane>
    </a-tabs>
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { findByInstanceId, getFlowNodes } from '@/api/bpm/instance'
import { findByDefId } from '@/api/bpm/model'
import { get as getDynamicForm } from '@/api/develop/dynamicForm'
import { toStringJSON } from 'xe-utils'
import WorkflowBpmnModeler from '@/components/Bpmn'
import ProcessViewer from '@/components/Bpmn/ProcessViewer'

export default {
  name: 'ApplyFormShow',
  mixins: [FormMixin],
  components: { ProcessViewer, WorkflowBpmnModeler },
  data () {
    return {
      currentActiveKey: 'form',
      // 流程id
      instanceId: '',
      // 流程节点, 染色用
      flowNodeList: [],
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
      this.currentActiveKey = 'flowChart'
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
      // 流程图节点染色
      await getFlowNodes(instanceId).then(res => {
        this.flowNodeList = res.data
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
      this.flowNodeList = []
      this.$refs.kfb.reset()
      this.handleCancel()
    },
    handleTabChange (activeKey) {
      this.currentActiveKey = activeKey
    }
  }
}
</script>

<style lang="less" scoped>

</style>
