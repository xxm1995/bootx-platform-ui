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
        label="中文名字"
        prop="chineseName"
      >
        <a-input v-model="form.chineseName" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="密码"
        prop="password"
      >
        <a-input v-model="form.password" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="身份证号"
        prop="idCard"
      >
        <a-input v-model="form.idCard" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="手机号"
        prop="mobilePhone"
      >
        <a-input v-model="form.mobilePhone" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="车牌号"
        prop="carLicense"
      >
        <a-input v-model="form.carLicense" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="电子邮件"
        prop="email"
      >
        <a-input v-model="form.email" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="其他"
        prop="other"
      >
        <a-input v-model="form.other" :disabled="showable"/>
      </a-form-model-item>
    </a-form-model>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, get, update } from '@/api/demo/dataSensitiveDemo'

export default {
  name: 'DataSensitiveDemoEdit',
  mixins: [FormMixin],
  data () {
    return {
      rawForm: {},
      form: {
        id: null,
        chineseName: null,
        password: null,
        idCard: null,
        mobilePhone: null,
        carLicense: null,
        email: null,
        other: null
      },
      rules: {
        name: [ { required: true, message: '请输入名称' } ],
        content: [ { required: true, message: '请输入要加密的内容' } ]
      }
    }
  },
  methods: {
    edit (id, type) {
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
            await update({ ...this.form, ...this.diffForm(this.rawForm, this.form, 'chineseName', 'password', 'idCard', 'mobilePhone', 'carLicense', 'email', 'other') })
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