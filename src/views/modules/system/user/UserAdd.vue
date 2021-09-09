<template>
  <a-drawer
    :title="title"
    :width="650"
    :mask-closable="showable"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading" style="margin-bottom: 80px">
      <a-form-model
        ref="form"
        :model="form"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :rules="rules">
        <a-form-model-item label="用户账号" prop="username">
          <a-input placeholder="请输入用户账号" v-model="form.username"/>
        </a-form-model-item>
        <a-form-model-item label="用户名称" prop="name">
          <a-input placeholder="请输入用户名称" v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="登录密码" prop="password" >
          <a-input-password
            type="password"
            placeholder="请输入登录密码"
            v-model="form.password" />
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="confirmPassword" >
          <a-input-password
            type="password"
            @blur="handleConfirmBlur"
            placeholder="请重新输入登录密码"
            v-model="form.confirmPassword"/>
        </a-form-model-item>

        <a-form-model-item label="手机号" prop="phone">
          <a-input placeholder="请输入用户手机号" v-model="form.phone"/>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input placeholder="请输入用户邮箱" v-model="form.email"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
    <div class="drawer-button" >
      <a-button @click="handleCancel" style="margin-right: .8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, existsUsername, existsPhone, existsEmail } from '@/api/system/user'

export default {
  name: 'UserAdd',
  mixins: [FormMixin],
  data () {
    return {
      confirmDirty: false,
      form: {
        name: '',
        username: '',
        phone: '',
        email: '',
        avatar: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称' }
        ],
        username: [
          { required: true, message: '请输入账号' },
          { validator: this.validateUsername, trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入登录密码!' },
          { validator: this.validateToNextPassword, trigger: 'change' }
        ],
        confirmPassword: [{ required: true, message: '请重新输入登录密码!' },
          { validator: this.compareToFirstPassword }
        ],
        phone: [{ validator: this.validatePhone, trigger: 'blur' }],
        email: [{ validator: this.validateEmail, trigger: 'blur' }]
      }
    }
  },
  methods: {
    edit () {
      this.resetForm()
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await add(this.form)
          setTimeout(() => {
            this.confirmLoading = false
            this.$emit('ok')
            this.visible = false
          }, 200)
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
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    validateToNextPassword (rule, value, callback) {
      const confirmPassword = this.form.confirmPassword
      if (value && confirmPassword && value !== confirmPassword) {
        callback('两次输入的密码不一样！')
      }
      if (value && this.confirmDirty) {
        this.$refs.form.validateField(['confirmPassword'])
      }
      callback()
    },
    compareToFirstPassword (rule, value, callback) {
      if (value && value !== this.form.password) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },
    validateUsername (rule, value, callback) {
      existsUsername(value).then((res) => {
        if (!res.data) {
          callback()
        } else {
          callback('该账户已存在!')
        }
      })
    },
    validatePhone (rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
          existsPhone(value).then((res) => {
            if (!res.data) {
              callback()
            } else {
              callback('手机号已存在!')
            }
          })
        } else {
          callback('请输入正确格式的手机号码!')
        }
      }
    },
    validateEmail (rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(value)) {
          existsEmail(value).then((res) => {
            if (!res.data) {
              callback()
            } else {
              callback('邮箱已存在!')
            }
          })
        } else {
          callback('请输入正确格式的邮箱!')
        }
      }
    }
  }
}
</script>

<style lang="less">

</style>
