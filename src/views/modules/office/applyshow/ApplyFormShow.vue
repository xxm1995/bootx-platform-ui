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
        <a-card :bordered="false">
          <div style="display: flex;justify-content: center">
            <a-form-model
              ref="form"
              :model="form"
              :rules="rules"
            >
              <a-form-model-item label="处理方式" prop="type">
                <a-radio-group v-model="form.type" :default-value="1" button-style="solid">
                  <a-radio-button value="pass">通过</a-radio-button>
                  <a-radio-button value="reject">驳回</a-radio-button>
                </a-radio-group>
              </a-form-model-item>
              <a-form-model-item label="审批意见" prop="reason">
                <a-textarea v-model="form.reason"/>
              </a-form-model-item>
            </a-form-model>
          </div>
          <div style="display: flex;justify-content: center">
            <a-button type="primary" @click="handleOk">
              确定
            </a-button>
          </div>
        </a-card>
      </a-tab-pane>
      <a-tab-pane key="history" tab="历史信息" force-render>
        <a-timeline>
          <a-timeline-item v-for="o in taskList" :key="o.id">
            <p>开始时间: {{ o.startTime }}</p>
            <p>环节: {{ o.taskName }}</p>
            <p>处理人: {{ o.userName }}</p>
            <p>结束时间: {{ o.endTime }}</p>
          </a-timeline-item>
        </a-timeline>
      </a-tab-pane>
      <a-tab-pane key="flowChart" tab="流程图" force-render>
        <process-viewer
          ref="processViewer"
          :height="750"
          :instance="instance"
          :node-task-list="nodeTaskList"
          :flow-node-list="flowNodeList"
          :xml="bpmModel.modelEditorXml"/>
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
import { findAllByInstanceId, getNodeTasks, pass, reject } from '@/api/bpm/task'

export default {
  name: 'ApplyFormShow',
  mixins: [FormMixin],
  components: { ProcessViewer, WorkflowBpmnModeler },
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
      // 节点任务列表
      nodeTaskList: null,
      // 表单结构
      dynamicFormStatic: {},
      // 流程模型
      bpmModel: {},
      // 流程实例
      instance: {},
      form: {
        type: 'pass',
        reason: ''
      },
      rules: {
        type: [{ required: true, message: '请选择类型!' }],
        reason: [{ required: true, message: '请输入审批意见!' }]
      }
    }
  },
  methods: {
    async edit (instanceId, type, taskId) {
      this.currentActiveKey = 'flowChart'
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
        await getDynamicForm(this.bpmModel.formId).then(res => {
          this.dynamicFormStatic = toStringJSON(res.data.value)
          this.$refs.kfb.setData(this.instance.formVariables)
        })
      }
    },
    /**
     * 提交处理
     */
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const form = {
            taskId: this.taskId,
            reason: this.form.reason
          }
          this.$confirm({
            title: '警告',
            content: '确实确定处理当前任务!',
            onOk: () => {
              this.confirmLoading = true
              if (this.form.type === 'pass') {
                pass(form)
                this.$message.success('任务已通过')
              } else {
                reject(form)
                this.$message.success('任务已驳回')
              }
              this.confirmLoading = false
              this.$emit('ok')
              this.handleClose()
            }
          })
        } else {
          return false
        }
      })
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