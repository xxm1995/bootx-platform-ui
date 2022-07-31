<template>
  <a-form-model
    ref="form"
    :model="form"
    :rules="rules"
  >
    <a-form-model-item prop="phone">
      <a-input
        size="large"
        type="text"
        placeholder="请输入手机号"
        v-model="form.phone"
      >
        <template #prefix>
          <a-icon type="phone" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </template>
      </a-input>
    </a-form-model-item>
    <a-row :span="24">
      <a-col :span="16">
        <a-form-model-item prop="smsCaptcha">
          <a-input
            size="large"
            type="text"
            placeholder="验证码"
            autocomplete="false"
            v-model="form.smsCaptcha"
          >
            <template #prefix>
              <a-icon type="safety-certificate" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </template>
          </a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="8">
        <a-button
          style="margin-left: 10px"
          size="large"
          tabindex="-1"
          :disabled="state.smsSendBtn"
          @click.stop.prevent="getCaptcha"
          v-text="!state.smsSendBtn && '获取验证码' || '请等待 ' +(state.time+' s')"
        />
      </a-col>
    </a-row>
    <a-form-model-item>
      <a-button
        size="large"
        type="primary"
        htmlType="submit"
        class="login-button"
        @click="handleSubmit"
        :loading="state.loginBtn"
        :disabled="state.loginBtn"
      >登录</a-button>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { sendSmsCode } from '@/api/login/login'
import { mapActions } from 'vuex'
import { validateMobile } from '@/utils/validate'
export default {
  name: 'PhoneLogin',
  data () {
    return {
      form: {
        client: '',
        loginType: 'phone',
        phone: '',
        smsCaptcha: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号' },
          { validator: this.validatePhone }
        ],
        smsCaptcha: [{ required: true, message: '请输入验证码' }]
      },
      state: {
        loginBtn: false,
        smsSendBtn: false,
        time: 60
      }
    }
  },
  methods: {
    ...mapActions(['Login']),
    /**
     * 获取手机验证码
     */
    getCaptcha (e) {
      e.preventDefault()
      this.$refs.form.validateField('phone', async valid => {
        if (!valid) {
          const state = this.state
          state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
          sendSmsCode(this.form.phone).then(res => {
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，请查看短信',
              duration: 8
            })
          }).catch(() => {
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
          })
        } else {
          return false
        }
      })
    },
    /**
     * 校验手机号
     */
    validatePhone (rule, value, callback) {
      const { msg, result } = validateMobile(value)
      result ? callback() : callback(msg)
    },
    /**
     * 登录
     */
    handleSubmit (e) {
      e.preventDefault()
      const { Login } = this
      this.$refs.form.validate(async valid => {
        const state = this.state
        if (valid) {
          state.loginBtn = true
          Login(this.form)
            .then(() => this.$emit('loginSuccess'))
            .finally(() => {
              state.loginBtn = false
            })
        }
      })
    }
  },
  created () {
    this.form.client = process.env.VUE_APP_CLIENT
  }
}
</script>

<style scoped lang="less">
button.login-button {
  padding: 0 15px;
  font-size: 16px;
  height: 40px;
  width: 100%;
}
.login-code-img {
  /*margin-top: 2px;*/
  width: 100px;
  height: 38px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 38px;
  text-indent: 5px;
  text-align: center;
}
</style>
