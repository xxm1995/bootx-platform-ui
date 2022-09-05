<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.id" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="任务节点id"
          prop="taskId"
        >
          <a-input v-model="form.nodeId" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="跳过节点"
          prop="skip"
        >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.skip" :disabled="showable" />
        </a-form-model-item>
        <a-form-model-item
          label="多任务"
          prop="multi"
        >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.multi" disabled />
        </a-form-model-item>
        <a-form-model-item
          label="任务节点名称"
          prop="nodeName"
        >
          <a-input v-model="form.nodeName" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="分配类型"
          prop="assignType"
        >
          <a-select
            allowClear
            v-model="form.assignType"
            :disabled="showable"
            :filter-option="selectSearch"
            :options="assignTypeList"
            style="width: 100%"
            placeholder="选择处理人分配类型"
          />
        </a-form-model-item>
        <a-form-model-item
          label="分配的用户(固定人)"
          prop="userName"
        >
          <a-input v-model="form.userName" placeholder="请选择用户" disabled>
            <template #addonAfter>
              <a href="javascript:" :disabled="showable" @click="selectUserShow" >选择用户</a>
            </template>
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
    <b-user-select-modal ref="userSelectModal" @ok="selectUser" title="选择指定用户" :multiple="false"/>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, add, update } from '@/api/bpm/modelTask'
import BUserSelectModal from '@/components/Bootx/UserSelectModal/BUserSelectModal'
export default {
  name: 'BpmModelNodeEdit',
  components: { BUserSelectModal },
  mixins: [FormMixin],
  data () {
    return {
      assignTypeList: [],
      form: {
        id: null,
        nodeId: '',
        nodeName: '',
        skip: false,
        multi: false,
        assignType: undefined,
        userId: '',
        userName: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        nodeId: [{ required: true, message: '请输入任务节点ID!' }],
        nodeName: [{ required: true, message: '请输入任务节点名称!' }],
        assignType: [{ required: true, message: '请选择处理人分配类型!' }],
        userName: [{ required: true, message: '请选择处理人!' }],
        skip: [{ required: true, message: '' }]
      }
    }
  },
  methods: {
    async initData () {
      this.assignTypeList = await this.getDictDropDownAsync('BpmTaskAssignType')
    },
    /**
     * 编辑
     */
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          if (!this.form.assignType) {
            this.form.assignType = undefined
          }
          this.confirmLoading = false
        })
      } else {
        this.form = {}
        this.confirmLoading = false
      }
    },
    /**
     * 提交
     */
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await add(this.form)
          } else if (this.type === 'edit') {
            await update(this.form)
          }
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
        } else {
          return false
        }
      })
    },
    /**
     * 重置表单
     */
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    /**
     * 开启选择界面
     */
    selectUserShow () {
      this.$refs.userSelectModal.init(this.form.userId)
    },
    /**
     * 选中用户回调
     */
    selectUser (userId, user) {
      this.$set(this.form, 'userId', userId)
      this.$set(this.form, 'userName', user.name)
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style scoped>

</style>
