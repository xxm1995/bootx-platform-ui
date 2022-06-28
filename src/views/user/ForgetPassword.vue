<template>
  <div class="main user-layout-register">
    <a-steps class="steps" :current="currentTab">
      <a-step title="手机验证"/>
      <a-step title="更改密码"/>
    </a-steps>

    <a-form-model
      class="form"
      ref="form"
      :model="form"
      :rules="rules">
      <!--   手机验证码获取   -->
      <a-form-model-item
        prop="phone"
        v-show="currentTab === 0"
      >
        <a-input type="text" size="large" v-model="form.phone" placeholder="请输入手机号">
          <template #prefix>
            <a-icon type="phone" :style="{ color: 'rgba(0,0,0,.25)'}"/>
          </template>
        </a-input>
      </a-form-model-item>
      <a-form-model-item
        prop="captcha"
        v-show="currentTab === 0">
        <a-row :span="24">
          <a-col :span="16">
            <a-input
              size="large"
              type="text"
              placeholder="验证码"
              autocomplete="false"
              v-model="form.captcha"
            >
              <template #prefix>
                <a-icon type="safety-certificate" :style="{ color: 'rgba(0,0,0,.25)' }"/>
              </template>
            </a-input>
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
      </a-form-model-item>
      <!--    重置密码    -->
      <a-form-model-item
        label="密码"
        v-show="currentTab === 1"
        prop="password"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}">
        <a-row >
          <a-col :span="24">
            <password-level :visible="passwordLevelVisible" :password="form.password">
              <a-input-password
                type="password"
                placeholder="请输入新密码"
                @focus="passwordLevelVisible = true"
                @blur="passwordLevelVisible = false"
                v-model="form.password" >
                <template #prefix>
                  <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)'}"/>
                </template>
              </a-input-password>
            </password-level>
          </a-col>
        </a-row>
      </a-form-model-item>
      <a-form-model-item
        label="重复密码"
        v-show="currentTab === 1"
        prop="confirmPassword"
        :labelCol="{span: 5}"
        :wrapperCol="{span: 19}">
        <a-row >
          <a-col :span="24">
            <a-input-password
              type="password"
              placeholder="请重新输入新密码"
              v-model="form.confirmPassword">
              <template #prefix>
                <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)'}"/>
              </template>
            </a-input-password>
          </a-col>
        </a-row>
      </a-form-model-item>

      <a-form-model-item :wrapperCol="{span: 24}">
        <router-link style="float: left;" :to="{ name: 'login' }">
          <a-button >返回</a-button>
        </router-link>
        <a-button v-show="currentTab === 0" type="primary" @click="nextStep" style="float: right">下一步</a-button>
        <a-button v-show="currentTab === 1" type="primary" @click="nextStep" style="float: right">提交</a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script>
import { sendPhoneForgetCaptcha, validatePhoneForgetCaptcha } from '@/api/system/userAssist'
import { validateMobile } from '@/utils/validate'
import PasswordLevel from '@/components/PasswordLevel'

export default {
  name: 'ForgetPassword',
  components: {
    PasswordLevel
  },
  computed: {
    rules () {
      return {
        phone: [
          { required: true, message: '请输入手机号!' },
          { validator: this.validatePhone }
        ],
        captcha: [
          { required: true, message: '请输入验证码!' },
          { validator: this.validatePhoneForgetCaptcha, trigger: 'blur' }
        ],
        newPassword: [{ required: true, message: '请输入新密码!' },
          { validator: this.validateNewPassword, trigger: 'change' }
        ],
        confirmPassword: [{ required: true, message: '请重新输入新密码!' },
          { validator: this.validateConfirmPassword }
        ]
      }
    }
  },
  data () {
    return {
      currentTab: 0,
      confirmDirty: false,
      passwordLevelVisible: false,
      forgetBtn: false,
      form: {
        phone: '',
        captcha: '',
        password: '',
        confirmPassword: ''
      },
      state: {
        time: 120,
        smsSendBtn: false
      }
    }
  },
  methods: {
    /**
     * 下一步
     */
    nextStep () {
      this.$refs.form.validateField(['phone', 'captcha'], async valid => {
        if (!valid) {
          this.currentTab = 1
        }
      })
    },
    /**
     * 获取验证码
     */
    getCaptcha () {
      this.$refs.form.validateField(['phone'], async valid => {
        if (!valid) {
          sendPhoneForgetCaptcha(this.form.phone).then(() => {
            this.$message.info('发送验证码成功')
            const state = this.state
            state.smsSendBtn = true
            const interval = window.setInterval(() => {
              if (state.time-- <= 0) {
                state.time = 120
                state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)
          })
        }
      })
    },
    /**
     * 校验验证码
     */
    async validatePhoneForgetCaptcha (rule, value, callback) {
      console.log(value)
      if (!(this.currentTab === 1 && value)) {
        callback()
        return
      }
      const { data } = await validatePhoneForgetCaptcha(this.form.phone, value)
      data ? callback() : callback('验证码错误')
    },
    /**
     * 校验手机号
     */
    validatePhone (rule, value, callback) {
      if (this.currentTab !== 0) {
        callback()
        return
      }
      const { msg, result } = validateMobile(value)
      result ? callback() : callback(msg)
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
    }
  }
}
</script>

<style lang="less" scoped>
.form{
  margin-top: 30px;

  /deep/ .password-retrieval-form {
    max-width: 368px;
    //margin: 40px auto 0;

    .ant-form-explain {
      text-align: left;
    }
  }
}

</style>
