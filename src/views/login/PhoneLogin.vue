<template>
  <a-form
    id="formLogin"
    class="user-layout-login"
    ref="formLogin"
    :form="form"
    @submit="handleSubmit"
  >
    <a-form-item>
      <a-input
        size="large"
        type="text"
        placeholder="手机号 / 13000001111"
        v-decorator="[
          'mobile',
          {rules: [{ required: true, message: '请输入手机号' }], validateTrigger: 'change'}
        ]"
      >
        <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-row :span="24">
        <a-col :span="16">
          <a-input
            size="large"
            type="text"
            placeholder="验证码"
            autocomplete="false"
            v-decorator="[
              'code',
              {rules: [{ required: true, message: '请输入验证码' }]}
            ]"
          >
            <a-icon slot="prefix" type="safety-certificate" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-col>
        <a-col :span="8">
          <a-button
            class="getCaptcha"
            tabindex="-1"
            :disabled="state.smsSendBtn"
            @click.stop.prevent="getCaptcha"
            v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"
          ></a-button>
        </a-col>
      </a-row>
    </a-form-item>
    <a-form-item style="margin-top:24px">
      <a-button
        size="large"
        type="primary"
        htmlType="submit"
        class="login-button"
        :loading="state.loginBtn"
        :disabled="state.loginBtn"
      >确定</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { timeFix } from '@/utils/util'
import { sendSmsCode } from '@/api/login/login'
import { mapActions } from 'vuex'
export default {
  name: 'PhoneLogin',
  data () {
    return {
      form: this.$form.createForm(this),
      state: {
        loginBtn: false,
        smsSendBtn: false,
        time: 60
      }
    }
  },
  methods: {
    ...mapActions(['loginByPhone', 'Logout']),
    getCaptcha (e) {
      e.preventDefault()
      const { form: { validateFields }, state } = this

      validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (state.time-- <= 0) {
              state.time = 60
              state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          sendSmsCode(values.mobile).then(res => {
            setTimeout(hide, 2500)
            this.$notification['success']({
              message: '提示',
              description: '验证码获取成功，您的验证码为：' + res.data,
              duration: 8
            })
          }).catch(err => {
            setTimeout(hide, 1)
            clearInterval(interval)
            state.time = 60
            state.smsSendBtn = false
            this.requestFailed(err)
          })
        }
      })
    },

    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        loginByPhone
      } = this

      validateFields((err, values) => {
        if (!err) {
          loginByPhone(values)
            .then(() => this.$emit('loginSuccess'))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    requestFailed (err) {
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).msg || '请求出现错误，请稍后再试',
        duration: 4
      })
    }
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
