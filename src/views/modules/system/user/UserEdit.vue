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
        <a-form-model-item label="关联终端" prop="clientIdList">
          <a-select
            allowClear
            mode="multiple"
            v-model="form.clientIdList"
            :default-value="form.clientIdList"
            :filter-option="search"
            style="width: 100%"
            placeholder="选择关联的终端"
          >
            <a-select-option v-for="o in clientList" :key="o.id">
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
import { get, update } from '@/api/system/user'
import { existsUsernameNotId, existsPhoneNotId, existsEmailNotId } from '@/api/system/userAssist'
import { validateMobile, validateEmail } from '@/utils/validate'
import { findAllByAlonePrem } from '@/api/system/client'

export default {
  name: 'UserEdit',
  mixins: [FormMixin],
  data () {
    return {
      clientList: [],
      form: {
        id: '',
        name: '',
        username: '',
        phone: '',
        email: '',
        clientIdList: [],
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
      this.initClientList()
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
    // 初始化终端列表
    async initClientList () {
      const { data } = await findAllByAlonePrem()
      this.clientList = data.map(res => {
        return {
          id: res.id,
          name: res.name
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
    search (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
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
        if (validateEmail(value).result) {
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
