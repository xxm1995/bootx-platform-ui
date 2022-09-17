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
      <a-tab-pane key="handler" tab="任务处理" v-if="!isView" force-render>
        <task-operate
          :task-list="taskList"
          :task-id="taskId"
          :instance="instance"
          @close="handleClose"
          @ok="handleOk"
        />
      </a-tab-pane>
      <a-tab-pane key="history" tab="历史信息" force-render>
        <task-history
          :task-list="taskList"
          :instance="instance"
        />
      </a-tab-pane>
      <a-tab-pane key="flowChart" tab="流程图" force-render>
        <flow-chart
          :instance="instance"
          :bpm-model="bpmModel"
          :flow-node-list="flowNodeList"
          :node-task-list="nodeTaskList"
        />
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
import { findAllByInstanceId, getNodeTasks } from '@/api/bpm/task'
import TaskHistory from '@/views/modules/office/applyshow/TaskHistory'
import FlowChart from '@/views/modules/office/applyshow/FlowChart'
import TaskOperate from '@/views/modules/office/applyshow/TaskOperate'

export default {
  name: 'ApplyFormShow',
  components: { TaskOperate, FlowChart, TaskHistory },
  mixins: [FormMixin],
  props: {
    isView: { type: Boolean, default: false }
  },
  data () {
    return {
      currentActiveKey: 'form',
      confirmLoading: false,
      // 任务id
      taskId: '',
      // 流程id
      instanceId: '',
      // 流程节点, 染色用
      flowNodeList: [],
      // 任务列表组
      taskList: [],
      // 节点任务列表 历史用
      nodeTaskList: {},
      // 表单结构
      dynamicFormStatic: {},
      // 流程模型
      bpmModel: {},
      // 流程实例
      instance: {}
    }
  },
  methods: {
    async edit (instanceId, type, taskId) {
      this.currentActiveKey = 'form'
      this.instanceId = instanceId
      this.taskId = taskId
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
      getFlowNodes(instanceId).then(res => {
        this.flowNodeList = res.data
      })
      // 任务列表 历史
      findAllByInstanceId(instanceId).then(res => {
        this.taskList = res.data
      })
      // 获取流程节点的分组任务信息 节点显示
      getNodeTasks(instanceId).then(res => {
        this.nodeTaskList = res.data
      })
      if (this.bpmModel.formId) {
        // 获取关联动态表单
        getDynamicForm(this.bpmModel.formId).then(res => {
          this.dynamicFormStatic = toStringJSON(res.data.value)
          this.$nextTick(() => {
            this.$refs.kfb.setData(this.instance.formVariables)
          })
        })
      }
    },
    /**
     * 处理成功
     */
    handleOk () {
      this.handleClose()
      this.$emit('ok')
    },
    /**
     * 关闭处理
     */
    handleClose () {
      this.bpmModel = {}
      this.dynamicFormStatic = {}
      this.flowNodeList = []
      this.$refs.kfb.reset()
      this.$emit('close')
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
