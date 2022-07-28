<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel">
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
        <a-form-model-item label="表单名称" prop="name" >
          <a-input v-model="form.name" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item label="表单编码" prop="code" >
          <a-input v-model="form.code" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark" >
          <a-textarea v-model="form.remark" :disabled="showable"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" type="primary" :loading="confirmLoading" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, get, update, existsByCode, existsByCodeNotId } from '@/api/develop/dynamicForm'

export default {
  name: 'DynamicFormEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入表单编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入表单名称' }
        ]
      }
    }
  },
  methods: {
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          // 删除动态表单模板值
          delete this.value
          this.confirmLoading = false
        })
      } else {
        this.confirmLoading = false
      }
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await add(this.form)
          } else if (this.type === 'edit') {
            await update(this.form)
          }
          setTimeout(() => {
            this.confirmLoading = false
            this.$emit('ok')
            this.visible = false
          }, 200)
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    async validateCode (rule, value, callback) {
      const { code, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await existsByCodeNotId(code, id)
      } else {
        res = await existsByCode(code)
      }
      if (!res.data) {
        callback()
      } else {
        callback('该编码已存在!')
      }
    }
  }
}
</script>

<style scoped>

</style>
