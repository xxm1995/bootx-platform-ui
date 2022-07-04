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
        <password-level :visible="passwordLevelVisible" :password="form.password">
          <a-form-model-item label="登录密码" prop="password" >
            <a-input-password
              type="password"
              placeholder="请输入登录密码"
              @focus="passwordLevelVisible = true"
              @blur="passwordLevelVisible = false"
              v-model="form.password" />
          </a-form-model-item>
        </password-level>
        <a-form-model-item label="确认密码" prop="confirmPassword" >
          <a-input-password
            type="password"
            placeholder="请重新输入登录密码"
            v-model="form.confirmPassword"/>
        </a-form-model-item>
        <a-form-model-item label="关联应用" prop="appIdList">
          <a-select
            allowClear
            mode="multiple"
            v-model="form.appIdList"
            :default-value="form.appIdList"
            :filter-option="search"
            style="width: 100%"
            placeholder="选择关联的应用"
          >
            <a-select-option v-for="o in applications" :key="o.id">
              {{ o.name }}
            </a-select-option>
          </a-select>
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
import PasswordLevel from '@/components/PasswordLevel'
import { add } from '@/api/system/user'
import { existsUsername, existsPhone, existsEmail } from '@/api/system/userAssist'
import { validateEmail, validateMobile } from '@/utils/validate'
import { findAll } from '@/api/system/client'

export default {
  name: 'UserAdd',
  mixins: [FormMixin],
  components: {
    PasswordLevel
  },
  data () {
    return {
      confirmDirty: false,
      applications: [],
      passwordLevelVisible: false,
      form: {
        name: '',
        username: '',
        phone: '',
        email: '',
        appIdList: [],
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
      this.initApplications()
      this.confirmLoading = false
      this.confirmDirty = false
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
    // 初始化应用列表
    async initApplications () {
      const { data } = await findAll()
      this.applications = data.map(res => {
        return {
          id: res.id,
          name: res.name
        }
      })
    },
    search (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
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
        const { msg, result } = validateMobile(value)
        if (result) {
          existsPhone(value).then((res) => {
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
        if (validateEmail(value).result) {
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
