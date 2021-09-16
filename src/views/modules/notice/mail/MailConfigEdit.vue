<template>
  <a-modal
    :title="title"
    :width="640"
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
        label="邮件服务器地址"
        prop="host"
      >
        <a-input v-model="form.host" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="邮件服务器端口"
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
        label="邮箱服务器账号"
        prop="username"
      >
        <a-input v-model="form.username" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="邮箱服务器密码"
        prop="password"
      >
        <a-input v-model="form.password" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="邮箱服务器发送人"
        prop="sender"
      >
        <a-input v-model="form.sender" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="邮箱服务器from"
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

    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, get, update } from '@/api/notice/mailConfig'
import { getDictItems } from '@/components/Bootx/Dict/DictUtils'

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
          { required: true, message: '请输入终端编码' }
        ],
        name: [
          { required: true, message: '请输入终端名称' }
        ],
        captcha: [
          { required: true, message: '请验证码启用状态' }
        ],
        enable: [
          { required: true, message: '请选择启用状态' }
        ],
        timeout: [
          { required: true, message: '请填写超时时间', trigger: 'blur' }
        ]
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
        this.confirmLoading = false
        this.resetForm()
      }
      this.initSecurityTypeList()
    },
    handleOk () {
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
    },
    initSecurityTypeList () {
      this.securityTypeList = getDictItems(this.mailSecurityCode).map(o => {
        o.code = Number(o.code)
        return o
      })
    }
  }
}
</script>

<style scoped>

</style>
