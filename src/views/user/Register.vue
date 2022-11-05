<template>
  <div class="main user-layout-register">
    <h3><span>注册</span></h3>
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules">
      <a-form-model-item prop="username">
        <a-input v-model="form.username" size="large" type="text" autocomplete="false" placeholder="请输入登录账号">
          <template #prefix>
            <a-icon type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </template>
        </a-input>
      </a-form-model-item>

      <password-level :visible="passwordLevelVisible" :password="form.password">
        <a-form-model-item prop="password">
          <a-input
            v-model="form.password"
            size="large"
            type="password"
            @focus="passwordLevelVisible = true"
            @blur="passwordLevelVisible = false"
            autocomplete="false"
            placeholder="请输入密码">
            <template #prefix>
              <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </template>
          </a-input>
        </a-form-model-item>
      </password-level>

      <a-form-model-item prop="confirmPassword">
        <a-input v-model="form.confirmPassword" size="large" type="password" autocomplete="false" placeholder="确认密码">
          <template #prefix>
            <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </template>
        </a-input>
      </a-form-model-item>
      <a-row :span="24" >
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

      <a-form-model-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="register-button"
          :loading="registerBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="registerBtn">注册
        </a-button>
        <router-link class="login" :to="{ name: 'login' }">使用已有账户登录</router-link>
      </a-form-model-item>

    </a-form-model>
  </div>
</template>

<script>
import { existsUsername } from '@/api/system/userAssist'
import PasswordLevel from '@/components/PasswordLevel'
import { imgCaptcha } from '@/api/system/captcha'
import { register } from '@/api/login/login'

export default {
  name: 'Register',
  components: {
    PasswordLevel
  },
  data () {
    return {
      captchaData: '',
      passwordLevelVisible: false,
      form: {
        userName: '',
        password: '',
        confirmPassword: '',
        captchaKey: '',
        captcha: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入登录账号!' },
          { validator: this.checkUsername }
        ],
        password: [
          { required: true, message: '请输入登录密码!' },
          { validator: this.validateToNextPassword, trigger: 'change' }
        ],
        confirmPassword: [
          { required: true, message: '请重新输入登录密码!' },
          { validator: this.compareToFirstPassword }
        ],
        captcha: [{ required: true, message: '请输入验证码!' }]
      },
      registerBtn: false
    }
  },
  methods: {
    /**
     * 页面初始化
     */
    init () {
      this.getCaptcha()
    },
    /**
     * 用户名检查
     */
    checkUsername (rule, value, callback) {
      existsUsername(value).then((res) => {
        if (!res.data) {
          callback()
        } else {
          callback('用户名已存在!')
        }
      })
    },
    validateToNextPassword (rule, value, callback) {
      if (value && this.confirmDirty) {
        this.$refs.form.validateField(['confirmPassword'])
      }
      callback()
    },
    compareToFirstPassword (rule, value, callback) {
      if (value && value !== this.form.password) {
        this.confirmDirty = true
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    /**
     * 注册
     */
    handleSubmit () {
      this.$refs.form.validate(async valid => {
        if (valid === true) {
          register(this.form).then((res) => {
            this.$message.info('注册成功')
            this.$router.push({ name: 'login' })
          })
        }
      })
    },
    /**
     * 获取验证码
     */
    getCaptcha () {
      imgCaptcha().then(result => {
        const res = result.data
        this.captchaData = res.captchaData
        this.form.captchaKey = res.captchaKey
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less">
.user-register {

  &.error {
    color: #ff0000;
  }

  &.warning {
    color: #ff7e05;
  }

  &.success {
    color: #52c41a;
  }

}

.user-layout-register {
  .ant-input-group-addon:first-child {
    background-color: #fff;
  }
}
</style>
<style lang="less" scoped>
.user-layout-register {

  & > h3 {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .register-button {
    width: 50%;
  }

  .login {
    float: right;
    line-height: 40px;
  }
}
</style>
