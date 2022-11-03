<template>
  <a-modal
    title="手机绑定"
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
        <a-form-model-item label="手机" prop="phone">
          <a-input v-model="form.phone" placeholder="手机号码"></a-input>
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="captcha">
          <a-input
            :maxLength="8"
            placeholder="验证码"
            v-model="form.captcha"
          >
            <template #addonAfter>
              <a :disabled="state.captcha" href="javascript:" @click="sendPhoneCaptcha">
                {{ !state.captcha && '获取验证码' || '请等待 ' +(state.captchaTime+' s') }}
              </a>
            </template>
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button @click="handleCancel">取消</a-button>
      <a-button :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { bindPhone } from '@/api/system/user'
import { validateMobile } from '@/utils/validate'
import {
  existsPhone,
  sendPhoneChangeCaptcha,
  validatePhoneChangeCaptcha
} from '@/api/system/userAssist'

export default {
  name: 'PhoneBind',
  mixins: [FormMixin],
  data () {
    return {
      state: {
        captcha: false,
        captchaTime: 120
      },
      form: {
        phone: '',
        captcha: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入新手机号!' },
          { validator: this.validatePhone, trigger: 'change' },
          { validator: this.validateBindPhone, trigger: 'blur' }
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
          bindPhone(this.form.phone, this.form.captcha).then(() => {
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
     * 校验手机号
     */
    validatePhone (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const { msg, result } = validateMobile(value)
      result ? callback() : callback(msg)
    },
    /**
     * 后台校验手机号是否被使用
     */
    validateBindPhone (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const { msg, result } = validateMobile(value)
      result ? callback() : callback(msg)
      const { data } = existsPhone(value)
      data ? callback('手机号已被使用') : callback()
    },
    /**
     * 验证码校验
     */
    async validateCaptcha (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const { data } = await validatePhoneChangeCaptcha(this.form.phone, value)
      data ? callback() : callback('验证码错误')
    },
    /**
     * 发送验证码 绑定手机
     */
    sendPhoneCaptcha () {
      this.$refs.form.validateField(['phone'], async valid => {
        if (!valid) {
          sendPhoneChangeCaptcha(this.form.phone).then(() => {
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
