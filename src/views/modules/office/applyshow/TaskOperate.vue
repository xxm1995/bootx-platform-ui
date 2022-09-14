<template>
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
        <a-form-model-item v-show="nextModes.length > 1" label="下一步环节" prop="nextNodeId">
          <a-select
            allowClear
            v-model="form.nextNodeId"
            style="width: 100%"
            placeholder="选择下一步环节"
            @change="changeNextNode"
            :options="nextModes"
          />
        </a-form-model-item>
        <a-form-model-item v-if="nextModes.length === 1" label="下一步环节">
          {{ nextNode.nodeName }}
        </a-form-model-item>
        <a-form-model-item label="处理人" prop="assignShow">
          <a-input v-model="form.assignShow" placeholder="请选择下一步环节处理用户" disabled>
            <template #addonAfter>
              <a href="javascript:" :disabled="showable" @click="selectUserShow">选择用户</a>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="主键" prop="assignShow" hidden="true" >
          <a-input v-model="form.assignShow" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item label="审批意见" prop="reason">
          <a-textarea v-model="form.reason" placeholder="请输入审批意见"/>
        </a-form-model-item>
      </a-form-model>
    </div>
    <div style="display: flex;justify-content: center">
      <a-button type="primary" @click="handleOk">
        确定
      </a-button>
    </div>
    <!--  用户分配 -->
    <b-user-select-modal ref="userSelectModal" @ok="selectUser" :multiple="nextMulti"/>
  </a-card>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { approve } from '@/api/bpm/task'
import { getNextNodes, listByModelId } from '@/api/bpm/modelNode'
import { SELECT_OPTION, USER, USER_GROUP } from '@/views/modules/bpm/model/BpmModelNodeCode'
import BUserSelectModal from '@/components/Bootx/UserSelectModal/BUserSelectModal'

export default {
  name: 'TaskOperate',
  components: { BUserSelectModal },
  mixins: [FormMixin],
  props: {
    // 任务id
    instance: { type: Object, required: true },
    // 任务id
    taskId: { type: String, required: true },
    // 任务列表
    taskList: { type: Array, required: true }
  },
  data () {
    return {
      nextModes: [],
      currentNode: {},
      nextNode: { },
      userTaskNodes: {},
      form: {
        type: 'pass',
        reason: '',
        nextNodeId: undefined
      }
    }
  },
  watch: {
    taskList () {
      this.init()
    }
  },
  computed: {
    rules () {
      return {
        type: [{ required: true, message: '请选择类型!' }],
        reason: [{ required: true, message: '请输入审批意见!' }],
        nextNodeId: [{ required: this.nextModes.length > 1, message: '请选择下一环节的任务节点!' }],
        assignShow: [{ required: [SELECT_OPTION].includes(this.nextNode?.assignType), message: '请选择下一环节的处理人!' }]
      }
    },
    nextMulti () {
      return this.nextNode?.multi
    }
  },
  methods: {
    async init () {
      if (!this.taskId) {
        return
      }
      await this.resetForm()
      // 获取当前任务节点
      const task = this.taskList.find(o => o.taskId === this.taskId)
      // 获取所有用户任务节点信息
      await listByModelId(this.instance.modelId).then(res => {
        this.userTaskNodes = res.data
      })
      // 当前任务节点配置
      this.currentNode = this.userTaskNodes.find(o => o.nodeId === task.nodeId)
      // 下一环节任务节点
      getNextNodes(this.instance.defId, task.nodeId).then(res => {
        this.nextModes = res.data
        if (this.nextModes.length === 1) {
          this.nextNode = this.userTaskNodes.find(o => o.nodeId === this.nextModes[0].value)
        } else {
          this.nextNode = null
        }
      })
    },
    changeNextNode () {
      this.nextNode = this.userTaskNodes.find(o => o.nodeId === this.form.nextNodeId)
    },
    /**
     * 提交处理
     */
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const form = {
            ...this.form,
            taskId: this.taskId
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
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 开启选择用户界面
     */
    selectUserShow () {
      this.$refs.userSelectModal.init()
    },
    /**
     * 选中用户回调
     */
    selectUser (userId, userInfo) {
      this.$set(this.form, 'assignRaw', userId)
      if (this.nextMulti) {
        const userNames = userInfo.map(o => o.name).join(',')
        this.$set(this.form, 'assignShow', userNames)
      } else {
        this.$set(this.form, 'assignShow', userInfo?.name)
      }
      this.$refs.form.validateField('assignShow')
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    }
  }
}
</script>

<style scoped>

</style>
