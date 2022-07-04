<template>
  <a-modal
    title="邮箱绑定"
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
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="form.email" placeholder="邮箱号码"></a-input>
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="captcha">
          <a-input
            :maxLength="8"
            placeholder="验证码"
            v-model="form.captcha"
          >
            <template #addonAfter>
              <a :disabled="state.captcha" href="javascript:" @click="sendEmailCaptcha">
                {{ !state.captcha && '获取验证码' || '请等待 ' +(state.captchaTime+' s') }}
              </a>
            </template>
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button :loading="confirmLoading" type="primary" @click="handleOk">绑定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { bindEmail } from '@/api/system/user'
import { validateEmail } from '@/utils/validate'
import { existsEmail, sendEmailChangeCaptcha, validateEmailChangeCaptcha } from '@/api/system/userAssist'

export default {
  name: 'EmailBind',
  mixins: [FormMixin],
  data () {
    return {
      state: {
        captcha: false,
        captchaTime: 120
      },
      form: {
        email: '',
        captcha: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入新邮箱号!' },
          { validator: this.validateEmail, trigger: 'change' },
          { validator: this.validateBindEmail, trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码!' },
          { validator: this.validateCaptcha, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    edit () {
      this.visible = true
      this.confirmLoading = false
      this.resetForm()
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          bindEmail(this.form.email, this.form.captcha).then(() => {
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
    /**
     * 校验邮箱
     */
    validateEmail (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const { msg, result } = validateEmail(value)
      result ? callback() : callback(msg)
    },
    /**
     * 后台校验邮箱是否被使用
     */
    validateBindEmail (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const { msg, result } = validateEmail(value)
      result ? callback() : callback(msg)
      const { data } = existsEmail(value)
      data ? callback('邮箱已被使用') : callback()
    },
    /**
     * 验证码校验
     */
    async validateCaptcha (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const { data } = await validateEmailChangeCaptcha(this.form.email, value)
      data ? callback() : callback('验证码错误')
    },
    /**
     * 发送验证码 绑定邮箱
     */
    sendEmailCaptcha () {
      this.$refs.form.validateField(['email'], async valid => {
        if (!valid) {
          sendEmailChangeCaptcha(this.form.email).then(() => {
            this.$message.info('发送验证码成功')
            const state = this.state
            state.captcha = true
            const interval = window.setInterval(() => {
              if (state.captchaTime-- <= 0) {
                state.captchaTime = 120
                state.captcha = false
                window.clearInterval(interval)
              }
            }, 1000)
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
