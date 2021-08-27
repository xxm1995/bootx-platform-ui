<template>
  <a-form-model
    :model="form"
    :rules="validatorRules"
    id="formLogin"
    class="user-layout-login"
    ref="formLogin"
  >
    <a-form-model-item
      prop="account">
      <a-input
        size="large"
        type="text"
        placeholder="账号/手机号/邮箱 "
        v-model="form.account"
      >
        <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input>
    </a-form-model-item>

    <a-form-model-item
      prop="password">
      <a-input-password
        size="large"
        type="password"
        autocomplete="false"
        placeholder="密码"
        v-model="form.password"
      >
        <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
      </a-input-password>
    </a-form-model-item>
    <a-form-item style="margin-top:24px">
      <a-button
        size="large"
        type="primary"
        htmlType="submit"
        class="login-button"
        @click="handleSubmit"
        :loading="state.loginBtn"
        :disabled="state.loginBtn"
      >确定</a-button>
    </a-form-item>
  </a-form-model>
</template>

<script>
  import { timeFix } from '@/utils/util'
  import { mapActions } from 'vuex'
  export default {
    name: 'UseLogin',
    data () {
      return {
        form: {
          account: 'xxm1995',
          password: '123456'
        },
        state: {
          loginBtn: false
        },
        code: {
          type: 'image',
          value: '',
          len: 4
        },
        randCodeImage: '',
        requestCodeSuccess: false,
        uuid: '',
        loginForm: {},
        validatorRules: {
          account: [{ required: true, message: '请输入账号!' }],
          password: [{ required: true, message: '请输入密码!' }]
        }
      }
    },
    methods: {
      ...mapActions(['Login', 'Logout']),
      /* 登录 */
      handleSubmit (e) {
        e.preventDefault()
        const {
          state,
          Login
        } = this
        this.$refs.formLogin.validate(err => {
          if (err) {
            const loginParams = { ...this.form }
            loginParams.client = 'pc'
            Login(loginParams)
              .then((res) => this.$emit('loginSuccess'))
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
      /* 登录失败 */
      requestFailed (err) {
        this.$notification['error']({
          message: '错误',
          description: err.msg || '请求出现错误，请稍后再试',
          duration: 4
        })
      }
    },
    created () {
      this.form.account = process.env.VUE_APP_USER_ACCOUNT
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
