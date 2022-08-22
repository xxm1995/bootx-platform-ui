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
      <a-row :span="24" v-show="currentTab === 0">
        <a-col :span="16">
          <a-form-model-item prop="captcha">
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
      <!--    重置密码    -->
      <a-form-model-item
        v-show="currentTab === 1"
        label="账号"
        :labelCol="{span: 3}"
        :wrapperCol="{span: 21}">
        <a-input disabled size="large" v-model="username"/>
      </a-form-model-item>
      <password-level :visible="passwordLevelVisible" :password="form.password">
        <a-form-model-item
          v-show="currentTab === 1"
          prop="password">
          <a-input-password
            type="password"
            size="large"
            placeholder="请输入新密码"
            @focus="passwordLevelVisible = true"
            @blur="passwordLevelVisible = false"
            v-model="form.password" >
            <template #prefix>
              <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)'}"/>
            </template>
          </a-input-password>
        </a-form-model-item>
      </password-level>
      <a-form-model-item
        v-show="currentTab === 1"
        prop="confirmPassword">
        <a-input-password
          type="password"
          size="large"
          placeholder="请重新输入新密码"
          v-model="form.confirmPassword">
          <template #prefix>
            <a-icon type="lock" :style="{ color: 'rgba(0,0,0,.25)'}"/>
          </template>
        </a-input-password>
      </a-form-model-item>

      <a-form-model-item :wrapperCol="{span: 24}">
        <a-button v-show="currentTab === 0" size="large" type="primary" @click="nextStep" style="width: 100%" :disabled="confirmLoading">下一步</a-button>
        <a-button v-show="currentTab === 1" size="large" type="primary" @click="handleOk" style="width: 100%" :disabled="confirmLoading">提交</a-button>
      </a-form-model-item>
    </a-form-model>
    <router-link style="float: right; margin-top: -20px" :to="{ name: 'login' }">
      使用已有账户登录
    </router-link>
  </div>
</template>

<script>
import { findUsernameByPhoneCaptcha, sendPhoneForgetCaptcha, validatePhoneForgetCaptcha } from '@/api/system/userAssist'
import { validateMobile } from '@/utils/validate'
import PasswordLevel from '@/components/PasswordLevel'
import { forgetPasswordByPhone } from '@/api/login/login'

export default {
  name: 'ForgetPassword',
  components: {
    PasswordLevel
  },
  computed: {
    rules () {
      return {
        phone: [
          { validator: this.validatePhone }
        ],
        captcha: [
          { required: true, message: '请输入验证码!' },
          { validator: this.validatePhoneForgetCaptcha, trigger: 'blur' }
        ],
        password: [
          { required: this.currentTab === 1, message: '请输入新密码!' },
          { validator: this.validateToNextPassword, trigger: 'change' }
        ],
        confirmPassword: [
          { required: this.currentTab === 1, message: '请重新输入新密码!' },
          { validator: this.compareToFirstPassword }
        ]
      }
    }
  },
  data () {
    return {
      currentTab: 0,
      confirmLoading: false,
      confirmDirty: false,
      passwordLevelVisible: false,
      forgetBtn: false,
      username: '',
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
      this.confirmLoading = true
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.currentTab = 1
          this.getUsernameByCaptcha()
        }
        this.confirmLoading = false
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
     * 根据手机号和验证码获取用户
     */
    getUsernameByCaptcha () {
      findUsernameByPhoneCaptcha(this.form.phone, this.form.captcha).then(({ data }) => {
        this.username = data
      })
    },
    /**
     * 提交
     */
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          forgetPasswordByPhone({
            phone: this.form.phone,
            captcha: this.form.captcha,
            password: this.form.password
          }).then(() => {
            this.confirmLoading = false
            this.$message.info('密码修改成功')
            this.$router.push({ name: 'login' })
          })
        } else {
          return false
        }
      })
    },
    /**
     * 校验验证码
     */
    async validatePhoneForgetCaptcha (rule, value, callback) {
      if (!this.form.phone) {
        callback()
        return
      }
      const { data } = await validatePhoneForgetCaptcha(this.form.phone, value)
      console.log(data)
      data ? callback() : callback('验证码错误')
    },
    /**
     * 校验手机号
     */
    validatePhone (rule, value, callback) {
      const { msg, result } = validateMobile(value)
      result ? callback() : callback(msg)
    },
    /**
     * 验证到下一个密码
     */
    validateToNextPassword (rule, value, callback) {
      if (value && this.confirmDirty) {
        this.$refs.form.validateField(['confirmPassword'])
      }
      callback()
    },
    /**
     * 密码校验
     */
    compareToFirstPassword (rule, value, callback) {
      if (this.currentTab === 0) {
        callback()
        return
      }
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
