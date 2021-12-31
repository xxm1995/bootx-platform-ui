<template>
  <a-drawer
    :title="title"
    :width="650"
    :mask-closable="showable"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading" style="margin-bottom: 3rem">
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
import {
  get,
  update,
  existsUsernameNotId,
  existsPhoneNotId,
  existsEmailNotId
} from '@/api/system/user'
import { validateMobile, validateEmail } from '@/utils/validate'

export default {
  name: 'UserEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: '',
        name: '',
        username: '',
        phone: '',
        email: '',
        avatar: ''
      },
      rules: {
        name: [{ required: true, message: '请输入名称' }
        ],
        username: [
          { required: true, message: '请输入账号' },
          { validator: this.validateUsername, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号' },
          { validator: this.validatePhone, trigger: 'blur' }
        ],
        email: [{ validator: this.validateEmail, trigger: 'blur' }]
      }
    }
  },
  computed: {
    diff () {
      return {
        phone: this.diffForm(this.form.phone, this.rawForm.phone),
        email: this.diffForm(this.form.email, this.rawForm.email)
      }
    }
  },
  methods: {
    edit (id) {
      this.confirmLoading = true
      get(id).then(res => {
        this.form = res.data
        delete this.form.password
        this.rawForm = { ...this.form }
        this.confirmLoading = false
      })
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await update({
            ...this.form,
            ...this.diff
          })
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
    validateUsername (rule, value, callback) {
      existsUsernameNotId(value, this.form.id).then((res) => {
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
        const { msg, result } = validateMobile(value)
        if (result) {
          existsPhoneNotId(value, this.form.id).then((res) => {
            if (!res.data) {
              callback()
            } else {
              callback('手机号已存在!')
            }
          })
        } else {
          callback(msg)
        }
      }
    },
    validateEmail (rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (validateEmail(value)) {
          existsEmailNotId(value, this.form.id).then((res) => {
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
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    }
  }
}
</script>

<style scoped>

</style>
