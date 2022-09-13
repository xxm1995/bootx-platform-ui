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
              style="width: 50%"
              :label-col="labelCol"
              :wrapper-col="wrapperCol"
              :model="form"
              :rules="rules"
            >
              <a-form-model-item label="处理方式" prop="type">
                <a-radio-group v-model="form.type" :default-value="1" button-style="solid">
                  <a-radio-button value="pass">通过</a-radio-button>
                  <a-radio-button value="reject">驳回</a-radio-button>
                  <a-radio-button v-if="currentNode.multi" value="notPass">不通过</a-radio-button>
                  <a-radio-button v-if="currentNode.multi" value="abstain">弃权</a-radio-button>
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
        <a-row :gutter="64">
          <a-col :span="8">
            <a-card title="任务历史" :bordered="false">
              <a-timeline>
                <a-timeline-item v-for="o in taskList" :key="o.id">
                  <p>开始时间: {{ o.startTime }}</p>
                  <p>环节: {{ o.nodeName }}</p>
                  <p>状态：{{ stateNameConvert(o.state) }}</p>
                  <p>处理人: {{ o.userName }}</p>
                  <p>结束时间: {{ o.endTime }}</p>
                </a-timeline-item>
              </a-timeline>
            </a-card>
          </a-col>
          <a-col :span="16">
            <a-card title="流程信息" :bordered="false">
              <a-descriptions :column="{md: 1}" bordered>
                <a-descriptions-item label="流程实例名称">
                  {{ instance.instanceName }}
                </a-descriptions-item>
                <a-descriptions-item label="流程定义的id">
                  {{ instance.defId }}
                </a-descriptions-item>
                <a-descriptions-item label="流程定义的名称">
                  {{ instance.defName }}
                </a-descriptions-item>
                <a-descriptions-item label="发起人名称">
                  {{ instance.startUserName }}
                </a-descriptions-item>
                <a-descriptions-item label="开始时间">
                  {{ instance.startTime }}
                </a-descriptions-item>
                <a-descriptions-item label="结束时间">
                  {{ instance.endTime }}
                </a-descriptions-item>
              </a-descriptions>
            </a-card>
          </a-col>
        </a-row>
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
import { findAllByInstanceId, getNodeTasks, approve } from '@/api/bpm/task'
import { dictConvert } from '@/components/Bootx/Dict/DictUtils'
import { getNode } from '@/api/bpm/modelNode'

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
      // 当前任务所在的节点
      currentNode: {},
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
        // 获取当前任务节点
        const task = this.taskList.find(o => o.taskId === taskId)
        console.log(task)
        getNode(this.instance.defId, task.nodeId).then(res => {
          this.currentNode = res.data
        })
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
            okText: '确定',
            onOk: async () => {
              this.confirmLoading = true
              await approve(form)
              this.$message.success('任务已处理')
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
    },
    resetForm () {
      if (!this.isView) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
    },
    /**
     * 任务状态翻译
     */
    stateNameConvert (state) {
      return dictConvert('BpmTaskState', state)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
