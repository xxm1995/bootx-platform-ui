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
          label="名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable" placeholder="请输入名称"/>
        </a-form-model-item>
        <a-form-model-item
          label="流程类型"
          prop="modelType"
        >
          <a-input v-model="form.modelType" :disabled="showable" placeholder="请输入流程类型"/>
        </a-form-model-item>
        <a-form-model-item
          label="关联表单"
          prop="formKey"
        >
          <a-select
            :disabled="showable"
            allowClear
            v-model="form.type"
            :filter-option="selectSearch"
            :options="dynamicFormList"
            style="width: 100%"
            placeholder="选择关联表单"
          />
        </a-form-model-item>
        <a-form-model-item
          label="备注"
          prop="remark"
        >
          <a-textarea v-model="form.remark" :disabled="showable" placeholder="请输入流程备注"/>
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
import { get, add, update } from '@/api/bpm/model'
import { list } from '@/api/develop/dynamicForm'
export default {
  name: 'ModelEdit',
  mixins: [FormMixin],
  data () {
    return {
      // 动态表单列表
      dynamicFormList: [],
      form: {
        id: null,
        name: '',
        modelType: '',
        formId: undefined,
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入流程模型名称!' }],
        modelType: [{ required: true, message: '请输入流程模型类型!' }]
      }
    }
  },
  methods: {
    /**
     * 初始化数据
     */
    initData () {
      // 动态表单列表
      list().then(res => {
        this.dynamicFormList = res.data.map(o => {
          return { label: o.name, value: o.id }
        })
      })
    },
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
  },
  mounted () {
    this.initData()
  }
}
</script>

<style scoped>

</style>
