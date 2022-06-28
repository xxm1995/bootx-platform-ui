<template>
  <a-modal
    title="密码修改"
    :width="modalWidth"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="旧密码" prop="oldPassword">
          <a-input-password v-model="form.oldPassword"/>
        </a-form-model-item>
        <a-form-model-item label="新密码" prop="newPassword">
          <password-level :visible="passwordLevelVisible" :password="form.newPassword">
            <a-input-password
              type="password"
              placeholder="请输入登录密码"
              @focus="passwordLevelVisible = true"
              @blur="passwordLevelVisible = false"
              v-model="form.password" />
          </password-level>
        </a-form-model-item>
        <a-form-model-item label="重复密码" prop="confirmPassword">
          <a-input-password v-model="form.confirmPassword"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { updatePassword } from '@/api/system/user'
import PasswordLevel from '@/components/PasswordLevel'

export default {
  name: 'PasswordEdit',
  mixins: [FormMixin],
  components: {
    PasswordLevel
  },
  data () {
    return {
      confirmDirty: false,
      passwordLevelVisible: false,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '请输入原密码!' }],
        newPassword: [{ required: true, message: '请输入新密码!' },
          { validator: this.validateNewPassword, trigger: 'change' }
        ],
        confirmPassword: [{ required: true, message: '请重新输入新密码!' },
          { validator: this.validateConfirmPassword }
        ]
      }
    }
  },
  methods: {
    edit () {
      this.visible = true
      this.confirmDirty = false
      this.confirmLoading = false
      this.resetForm()
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          updatePassword(this.form.oldPassword, this.form.newPassword).then(() => {
            this.confirmLoading = false
            this.$emit('ok')
            this.visible = false
          })
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
    // 验证新密码
    validateNewPassword (rule, value, callback) {
      if (value && this.confirmDirty) {
        this.$refs.form.validateField(['confirmPassword'])
      }
      callback()
    },
    // 验证确认密码
    validateConfirmPassword (rule, value, callback) {
      if (value && value !== this.form.newPassword) {
        this.confirmDirty = true
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
