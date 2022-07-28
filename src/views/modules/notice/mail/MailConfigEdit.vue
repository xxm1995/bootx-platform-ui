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
      <a-form-model-item label="主键" prop="id" hidden="true" >
        <a-input v-model="form.id" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="编号"
        prop="code"
      >
        <a-input v-model="form.code" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="名称"
        prop="name"
      >
        <a-input v-model="form.name" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="服务器地址"
        prop="host"
      >
        <a-input v-model="form.host" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="端口"
        prop="port"
      >
        <a-input-number
          v-model="form.port"
          :disabled="showable"
          :min="0"
          :max="65535"
          :step="1"
        />
      </a-form-model-item>
      <a-form-model-item
        label="发送人账号"
        prop="username"
      >
        <a-input v-model="form.username" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="发送人密码"
        prop="password"
      >
        <a-input-password
          v-model="form.password"
          :placeholder="addable?'请输入密码':'为空不修改密码'"
          :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="发送人sender"
        prop="sender"
      >
        <a-input v-model="form.sender" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="邮箱from"
        prop="from"
      >
        <a-input v-model="form.from" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="安全方式"
        prop="securityType"
      >
        <a-select
          :disabled="showable"
          allowClear
          v-model="form.securityType"
          style="width: 100%"
          placeholder="选择安全方式"
        >
          <a-select-option v-for="item in securityTypeList" :key="item.code">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>

    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, get, update, existsByCode, existsByCodeNotId } from '@/api/notice/mailConfig'

export default {
  name: 'MailConfigEdit',
  mixins: [FormMixin],
  data () {
    return {
      mailSecurityCode: 'MailSecurityCode',
      securityTypeList: [],
      form: {
        code: '',
        name: '',
        host: '',
        port: 465,
        username: '',
        password: '',
        sender: '',
        from: '',
        securityType: 1
      },
      rules: {
        code: [
          { required: true, message: '请输入配置编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入配置名称' }
        ],
        host: [
          { required: true, message: '请输入邮件服务器地址' }
        ],
        port: [
          { required: true, message: '请输入邮件服务器端口' }
        ],
        username: [
          { required: true, message: '请输入邮件发送人账号' }
        ],
        password: [
          { required: true, message: '请输入邮件发送人密码' }
        ],
        sender: [
          { required: true, message: '请输入邮件发送人Sender' }
        ],
        from: [
          { required: true, message: '请输入邮件From信息' }
        ],
        securityType: [
          { required: true, message: '请选择安全方式' }
        ]
      }
    }
  },
  computed: {
    diff () {
      return {
        password: this.diffForm(this.form.password, this.rawForm.password)
      }
    }
  },
  methods: {
    edit (id, type) {
      this.securityTypeList = this.getDictItemsByNumber(this.mailSecurityCode)
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.rawForm = { ...res.data }
          this.confirmLoading = false
        })
      } else {
        this.confirmLoading = false
      }
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await add(this.form)
          } else if (this.type === 'edit') {
            await update({
              ...this.form,
              ...this.diff
            })
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
    },
    async validateCode (rule, value, callback) {
      const { code, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await existsByCodeNotId(code, id)
      } else {
        res = await existsByCode(code)
      }
      if (!res.data) {
        callback()
      } else {
        callback('该编码已存在!')
      }
    }
  }
}
</script>

<style scoped>

</style>
