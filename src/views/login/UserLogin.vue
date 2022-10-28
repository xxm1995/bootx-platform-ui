<template>
  <a-form-model
    :model="form"
    :rules="rules"
    id="formLogin"
    class="user-layout-login"
    ref="formLogin"
  >
    <a-form-model-item prop="account">
      <a-input
        size="large"
        type="text"
        placeholder="账号/手机号/邮箱 "
        v-model="form.account"
      >
        <template #prefix>
          <a-icon type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </template>
      </a-input>
    </a-form-model-item>
    <a-form-model-item prop="password">
      <a-input-password
        size="large"
        type="password"
        autocomplete="false"
        placeholder="密码"
        v-model="form.password"
      >
        <template #prefix>
          <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
        </template>
      </a-input-password>
    </a-form-model-item>

    <a-row :span="24" v-if="loginType.captcha">
      <a-col :span="16">
        <a-form-model-item prop="captcha">
          <a-input
            size="large"
            type="text"
            placeholder="验证码"
            v-model="form.captcha"
          >
            <template #prefix>
              <a-icon type="smile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </template>
          </a-input>
        </a-form-model-item>
      </a-col>
      <a-col :span="8" style="text-align: right">
        <img
          style="margin-top: 2px;"
          :src="captchaData"
          @click="getCaptcha"
          alt="验证码"/>
      </a-col>
    </a-row>
    <a-form-item>
      <a-button
        size="large"
        type="primary"
        htmlType="submit"
        class="login-button"
        @click="handleSubmit"
        :loading="state.loginBtn"
        :disabled="state.loginBtn"
      >登录</a-button>
    </a-form-item>
  </a-form-model>
</template>

<script>
import { mapActions } from 'vuex'
import { findByCode } from '@/api/system/loginType'
import { imgCaptcha } from '@/api/system/captcha'
export default {
  name: 'UseLogin',
  data () {
    return {
      form: {
        client: '',
        loginType: '',
        account: '',
        password: '123456',
        captchaKey: '',
        captcha: ''
      },
      captchaData: '',
      state: {
        loginBtn: false
      },
      code: {
        type: 'image',
        value: '',
        len: 4
      },
      loginType: {
        captcha: false,
        enable: true
      },
      rules: {
        account: [{ required: true, message: '请输入账号!' }],
        password: [{ required: true, message: '请输入密码!' }],
        captcha: [{ required: true, message: '请输入验证码!' }]
      }
    }
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    init () {
      // 获取登录方式
      findByCode(this.form.loginType).then(res => {
        this.loginType = res.data || {}
        if (this.loginType && this.loginType.captcha && this.loginType.enable) {
          this.getCaptcha()
        }
      })
    },
    /* 获取验证码 */
    getCaptcha () {
      imgCaptcha().then(result => {
        const res = result.data
        this.captchaData = res.captchaData
        this.form.captchaKey = res.captchaKey
      })
    },
    /* 登录 */
    handleSubmit (e) {
      e.preventDefault()
      const {
        state,
        Login
      } = this
      this.$refs.formLogin.validate(err => {
        if (err) {
          state.loginBtn = true
          Login(this.form)
            .then(() => this.$emit('loginSuccess'))
            .catch(() => {
              if (this.client.captcha) {
                this.getCaptcha()
              }
            })
            .finally(() => {
              state.loginBtn = false
            })
        }
      })
    }
  },
  created () {
    this.form.account = process.env.VUE_APP_USER_ACCOUNT
    this.form.client = process.env.VUE_APP_CLIENT
    this.form.loginType = 'password'
    this.init()
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
