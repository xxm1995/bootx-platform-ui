<template>
  <a-modal
    title="手机号修改"
    :width="modalWidth"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-steps class="steps" :current="currentTab">
        <a-step title="解绑旧手机"/>
        <a-step title="绑定新手机"/>
      </a-steps>
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="手机号" v-show="currentTab === 0">
          <span>{{ phone }}</span>
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="oldCaptcha" v-show="currentTab === 0">
          <a-input
            :maxLength="8"
            placeholder="验证码"
            v-model="form.oldCaptcha"
          >
            <template #addonAfter>
              <a :disabled="state.oldCaptcha" href="javascript:" @click="sendOldPhoneCaptcha">
                {{ !state.oldCaptcha && '获取验证码' || '请等待 ' +(state.oldCaptchaTime+' s') }}
              </a>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="phone" v-show="currentTab === 1">
          <a-input v-model="form.phone" placeholder="手机号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="newCaptcha" v-show="currentTab === 1">
          <a-input
            :maxLength="8"
            placeholder="验证码"
            v-model="form.newCaptcha"
          >
            <template #addonAfter>
              <a :disabled="state.newCaptcha" href="javascript:" @click="sendNewPhoneCaptcha">
                {{ !state.newCaptcha && '获取验证码' || '请等待 ' +(state.newCaptchaTime+' s') }}
              </a>
            </template>
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button v-show="currentTab === 0" :loading="confirmLoading" @click="handleCancel">取消</a-button>
      <a-button v-show="currentTab === 0" :loading="confirmLoading" type="primary" @click="nextStep">下一步</a-button>
      <a-button v-show="currentTab === 1" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { updatePhone } from '@/api/system/user'
import { FormMixin } from '@/mixins/FormMixin'
import { validateMobile } from '@/utils/validate'
import {
  existsPhone,
  sendCurrentPhoneChangeCaptcha,
  sendPhoneChangeCaptcha,
  validateCurrentPhoneChangeCaptcha, validatePhoneChangeCaptcha
} from '@/api/system/userAssist'

export default {
  name: 'PhoneEdit',
  mixins: [FormMixin],
  computed: {
    rules () {
      return {
        phone: [
          { required: this.currentTab === 1, message: '请输入新手机号!' },
          { validator: this.validatePhone, trigger: 'change' },
          { validator: this.validateNewPhone, trigger: 'blur' }
        ],
        oldCaptcha: [
          { required: true, message: '请输入验证码!' },
          { validator: this.validateOldCaptcha, trigger: 'blur' }
        ],
        newCaptcha: [
          { required: this.currentTab === 1, message: '请输入验证码!' },
          { validator: this.validateNewCaptcha, trigger: 'blur' }
        ]
      }
    }
  },
  props: {
    phone: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      confirmDirty: false,
      // 当前进度
      currentTab: 0,
      state: {
        oldCaptcha: false,
        newCaptcha: false,
        oldCaptchaTime: 120,
        newCaptchaTime: 120
      },
      form: {
        phone: '',
        oldCaptcha: '',
        newCaptcha: ''
      }
    }
  },
  methods: {
    edit () {
      this.visible = true
      this.currentTab = 0
      this.confirmDirty = false
      this.confirmLoading = false
      this.resetForm()
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          updatePhone(this.form).then(() => {
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
      if (this.currentTab !== 1) {
        callback()
        return
      }
      const { msg, result } = validateMobile(value)
      result ? callback() : callback(msg)
    },
    /**
     * 后台校验手机号是否被使用
     */
    validateNewPhone (rule, value, callback) {
      if (this.currentTab !== 1) {
        callback()
        return
      }
      const { msg, result } = validateMobile(value)
      result ? callback() : callback(msg)
      const { data } = existsPhone(value)
      data ? callback('手机号已被使用') : callback()
    },
    /**
     * 验证码校验 旧
     */
    async validateOldCaptcha (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const { data } = await validateCurrentPhoneChangeCaptcha(value)
      data ? callback() : callback('验证码错误')
    },
    /**
     * 验证码校验 新
     */
    async validateNewCaptcha (rule, value, callback) {
      if (!(this.currentTab === 1 && value)) {
        callback()
        return
      }
      const { data } = await validatePhoneChangeCaptcha(this.form.phone, value)
      data ? callback() : callback('验证码错误')
    },
    /**
     *  发送验证码 旧
     */
    sendOldPhoneCaptcha () {
      sendCurrentPhoneChangeCaptcha().then(() => {
        this.$message.info('发送验证码成功')
        const state = this.state
        state.oldCaptcha = true
        const interval = window.setInterval(() => {
          if (state.oldCaptchaTime-- <= 0) {
            state.oldCaptchaTime = 120
            state.oldCaptcha = false
            window.clearInterval(interval)
          }
        }, 1000)
      })
    },
    /**
     * 发送验证码 新手机
     */
    sendNewPhoneCaptcha () {
      this.$refs.form.validateField(['phone'], async valid => {
        console.log(valid)
        if (!valid) {
          sendPhoneChangeCaptcha(this.form.phone).then(() => {
            this.$message.info('发送验证码成功')
            const state = this.state
            state.newCaptcha = true
            const interval = window.setInterval(() => {
              if (state.newCaptchaTime-- <= 0) {
                state.newCaptchaTime = 120
                state.newCaptcha = false
                window.clearInterval(interval)
              }
            }, 1000)
          })
        }
      })
    },
    /**
     * 下一步
     */
    nextStep () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.currentTab = 1
        }
      })
    }
  }
}
</script>

<style scoped>
.steps {
  max-width: 360px;
  margin: 10px auto 30px;
}
</style>
