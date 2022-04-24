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
        label="编码"
        prop="code"
      >
        <a-input v-model="form.code" :disabled="showable||form.system"/>
      </a-form-model-item>
      <a-form-model-item
        label="名称"
        prop="name"
      >
        <a-input v-model="form.name" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="系统内置"
      >
        <a-tag v-if="form.system" color="green">是</a-tag>
        <a-tag v-else color="red">否</a-tag>
      </a-form-model-item>
      <a-form-model-item
        label="启用验证码"
        prop="captcha"
      >
        <a-switch checked-children="开" un-checked-children="关" v-model="form.captcha" :disabled="showable" />
      </a-form-model-item>
      <a-form-model-item
        label="启用状态"
        prop="enable"
      >
        <a-switch checked-children="开" un-checked-children="关" v-model="form.enable" :disabled="showable||form.system" />
      </a-form-model-item>
      <a-form-model-item
        label="超时时间(分钟)"
        prop="timeout"
      >
        <a-input-number
          v-model="form.timeout"
          :disabled="showable"
          :min="5"
          :step="5"
        />
      </a-form-model-item>
      <a-form-model-item
        label="密码可错误次数"
        prop="timeout"
      >
        <a-input-number
          v-model="form.pwdErrNum"
          :disabled="showable"
          :min="-1"
          :step="1"
        />
      </a-form-model-item>
      <a-form-model-item
        label="描述"
        prop="description"
      >
        <a-textarea v-model="form.description" :disabled="showable"/>
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
import { get, add, update, existsByCode, existsByCodeNotId } from '@/api/system/client'
export default {
  name: 'ClientEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        code: '',
        name: '',
        captcha: true,
        system: false,
        enable: true,
        timeout: 5,
        pwdErrNum: -1,
        description: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入终端编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入终端名称' }
        ],
        captcha: [
          { required: true, message: '请选择验证码启用状态' }
        ],
        enable: [
          { required: true, message: '请选择启用状态' }
        ],
        timeout: [
          { required: true, message: '请填写超时时间' },
          { min: 1, message: '超时时间需要大于等于1' }
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
      }
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
