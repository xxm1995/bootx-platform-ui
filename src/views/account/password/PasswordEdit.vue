<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="旧密码" prop="oldPassword">
        <a-input v-model="form.oldPassword"/>
      </a-form-model-item>
      <a-form-model-item label="新密码" prop="newPassword">
        <a-input v-model="form.newPassword"/>
      </a-form-model-item>
      <a-form-model-item label="重复密码" prop="confirmPassword">
        <a-input v-model="form.confirmPassword"/>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add } from '@/api/system/user'

export default {
  name: 'PasswordEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        newPassword: [{ required: true, message: '请输入新密码!' },
          { validator: this.validateToNextPassword, trigger: 'change' }
        ],
        confirmPassword: [{ required: true, message: '请重新输入新密码!' },
          { validator: this.compareToFirstPassword }
        ]
      }
    }
  },
  methods: {
    edit () {
      this.confirmLoading = false
      this.resetForm()
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await add(this.form)
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
    validateToNextPassword (rule, value, callback) {
      const confirmPassword = this.form.confirmPassword
      if (value && confirmPassword && value !== confirmPassword) {
        callback('两次输入的密码不一样！')
      }
      if (value && this.confirmDirty) {
        this.$refs.form.validateField(['confirmPassword'])
      }
      callback()
    },
    compareToFirstPassword (rule, value, callback) {
      if (value && value !== this.form.password) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    }
  }
}
</script>

<style scoped>

</style>
