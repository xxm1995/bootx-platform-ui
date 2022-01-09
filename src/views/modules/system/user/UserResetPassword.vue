<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="用户账号" prop="username">
        <a-input disabled="" v-model="form.username"/>
      </a-form-model-item>
      <a-form-model-item label="用户名称" prop="name">
        <a-input disabled="" v-model="form.name"/>
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
          placeholder="请重新输入登录密码"
          v-model="form.confirmPassword"/>
      </a-form-model-item>
    </a-form-model>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, restartPassword } from '@/api/system/user'

export default {
  name: 'UserResetPassword',
  mixins: [FormMixin],
  data () {
    return {
      confirmDirty: false,
      form: {
        id: '',
        username: '',
        phone: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        password: [{ required: true, message: '请输入登录密码!' },
          { validator: this.validateToNextPassword, trigger: 'change' }
        ],
        confirmPassword: [{ required: true, message: '请重新输入登录密码!' },
          { validator: this.compareToFirstPassword }
        ]
      }
    }
  },
  methods: {
    edit (id) {
      this.title = '重置密码'
      this.confirmDirty = false
      this.confirmLoading = true
      get(id).then(res => {
        this.form = res.data
        this.form.password = ''
        this.confirmLoading = false
      })
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await restartPassword(this.form.id, this.form.password)
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

<style scoped>

</style>
