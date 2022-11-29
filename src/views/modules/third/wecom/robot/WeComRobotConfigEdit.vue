<template>
  <vxe-modal
    v-model="visible"
    :title="title"
    :width="modalWidth"
    :position="vxePosition"
    @close="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
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
          label="机器人编号"
          prop="code"
        >
          <a-input v-model="form.code" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="机器人名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="WebhookKey"
          prop="webhookKey"
        >
          <a-input v-model="form.webhookKey" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="备注"
          prop="remark"
        >
          <a-textarea v-model="form.remark" :disabled="showable"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </template>
  </vxe-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, existsByCode, existsByCodeNotId, get, update } from '@/api/third/weComRobotConfig'

export default {
  name: 'WecomRobotConfigEdit',
  mixins: [FormMixin],
  data () {
    return {
      securityTypeList: [],
      form: {
        code: '',
        name: '',
        webhookKey: '',
        remark: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入机器人编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入机器人名称' }
        ],
        webhookKey: [
          { required: true, message: '请输入webhook的Key值' }
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
            await update({ ...this.form, ...this.diffForm(this.rawForm, this.form, 'webhookKey') })
          }
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
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