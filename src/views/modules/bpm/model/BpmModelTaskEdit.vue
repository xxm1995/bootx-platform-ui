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
          label="关联模型id"
          prop="modelId"
        >
          <a-input v-model="form.modelId" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="流程定义id"
          prop="defId"
        >
          <a-input v-model="form.defId" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="流程key"
          prop="defKey"
        >
          <a-input v-model="form.defKey" :disabled="showable"/>
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
          <a-input v-model="form.assignType" :disabled="showable"/>
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
      form: {
        id: null,
        modelId: null,
        defId: null,
        defKey: null,
        taskId: null,
        taskName: null,
        assignType: null,
        userId: null,
      },
      rules: {
        modelId: [],
        defId: [],
        defKey: [],
        taskId: [],
        taskName: [],
        assignType: [],
        userId: [],
      }
    }
  },
  methods: {
    /**
     * 编辑
     */
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
      } else {
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
  }
}
</script>

<style scoped>

</style>
