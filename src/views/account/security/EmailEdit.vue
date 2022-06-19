<template>
  <a-modal
    title="邮箱修改"
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
        <a-step title="解绑旧邮箱"/>
        <a-step title="绑定新邮箱"/>
      </a-steps>
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="邮箱" v-show="currentTab === 0">
          <span>{{ email }}</span>
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="oldCaptcha" v-show="currentTab === 0">
          <a-input
            :maxLength="8"
            placeholder="验证码"
            v-model="form.oldCaptcha"
          >
            <template v-slot:addonAfter>
              <a :disabled="state.oldCaptcha" href="javascript:" @click="sendOldEmailCaptcha">
                {{ !state.oldCaptcha && '获取验证码' || '请等待 ' +(state.oldCaptchaTime+' s') }}
              </a>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email" v-show="currentTab === 1">
          <a-input v-model="form.email" placeholder="邮箱号码"></a-input>
        </a-form-model-item>
        <a-form-model-item label="验证码" prop="newCaptcha" v-show="currentTab === 1">
          <a-input
            :maxLength="8"
            placeholder="验证码"
            v-model="form.newCaptcha"
          >
            <template v-slot:addonAfter>
              <a :disabled="state.newCaptcha" href="javascript:" @click="sendNewEmailCaptcha">
                {{ !state.newCaptcha && '获取验证码' || '请等待 ' +(state.newCaptchaTime+' s') }}
              </a>
            </template>
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template v-slot:footer>
      <a-button v-show="currentTab === 0" :loading="confirmLoading" @click="handleCancel">取消</a-button>
      <a-button v-show="currentTab === 0" :loading="confirmLoading" type="primary" @click="nextStep">下一步</a-button>
      <a-button v-show="currentTab === 1" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { updateEmail } from '@/api/system/user'
import { FormMixin } from '@/mixins/FormMixin'
import { validateEmail } from '@/utils/validate'
import { existsEmail, sendCurrentEmailCaptcha, sendEmailCaptcha, validateCurrentEmailCaptcha, validateEmailCaptcha } from '@/api/system/userAssist'

export default {
  name: 'EmailEdit',
  mixins: [FormMixin],
  computed: {
    rules () {
      return {
        email: [
          { required: this.currentTab === 1, message: '请输入新邮箱号!' },
          { validator: this.validateEmail, trigger: 'change' },
          { validator: this.validateNewEmail, trigger: 'blur' }
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
    email: {
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
        email: '',
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
          updateEmail(this.form).then(() => {
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
      if (this.currentTab !== 1) {
        callback()
        return
      }
      const { msg, result } = validateEmail(value)
      console.log(msg, result)
      result ? callback() : callback(msg)
    },
    /**
     * 后台校验邮箱是否被使用
     */
    validateNewEmail (rule, value, callback) {
      if (this.currentTab !== 1) {
        callback()
        return
      }
      console.log(111)
      const { msg, result } = validateEmail(value)
      result ? callback() : callback(msg)
      const { data } = existsEmail(value)
      data ? callback('邮箱已被使用') : callback()
    },
    /**
     * 验证码校验 旧
     */
    async validateOldCaptcha (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const { data } = await validateCurrentEmailCaptcha(value)
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
      const { data } = await validateEmailCaptcha(this.form.email, value)
      data ? callback() : callback('验证码错误')
    },
    /**
     *  发送验证码 旧邮箱
     */
    sendOldEmailCaptcha () {
      sendCurrentEmailCaptcha().then(() => {
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
     * 发送验证码 新邮箱
     */
    sendNewEmailCaptcha () {
      this.$refs.form.validateField(['email'], async valid => {
        console.log(valid)
        if (!valid) {
          sendEmailCaptcha(this.form.email).then(() => {
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
