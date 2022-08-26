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
          <a-input v-model="form.id" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="任务节点id"
          prop="taskId"
        >
          <a-input v-model="form.taskId" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="任务节点名称"
          prop="taskName"
        >
          <a-input v-model="form.taskName" :disabled="showable"/>
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
          prop="userId"
        >
          <a-input v-model="form.userId" :disabled="showable"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, add, update } from '@/api/bpm/modelTask'
export default {
  name: 'BpmModelTaskEdit',
  mixins: [FormMixin],
  data () {
    return {
      assignTypeList: [],
      form: {
        id: null,
        taskId: '',
        taskName: '',
        assignType: undefined,
        userId: ''
      },
      rules: {
        taskId: [{ required: true, message: '请输入任务节点ID!' }],
        taskName: [{ required: true, message: '请输入任务节点名称!' }],
        assignType: [{ required: true, message: '请选择处理人分配类型!' }],
        userId: []
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
    }
  },
  mounted () {
    this.initData()
  }
}
</script>

<style scoped>

</style>
