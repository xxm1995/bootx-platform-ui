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
          <a-input placeholder="请输入用户账号" v-model="form.username" disabled/>
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
import { add, get, update } from '@/api/system/user'

export default {
  name: 'UserEdit',
  mixins: [FormMixin],
  data () {
    return {
      confirmDirty: false,
      form: {
        id: '',
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
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
      } else {
        this.resetForm()
      }
    },
    handleOk () {
      console.log(this.type)
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await add(this.form)
          } else if (this.type === 'edit') {
            await update(this.form)
          }
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
    }
  }
}
</script>

<style scoped>

</style>
