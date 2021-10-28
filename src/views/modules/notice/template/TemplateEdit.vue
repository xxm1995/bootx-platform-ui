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
        label="模板类型"
        prop="type"
      >
        <a-select
          :disabled="showable"
          allowClear
          v-model="form.type"
          style="width: 100%"
          placeholder="选择消息模板类型"
        >
          <a-select-option v-for="item in messageTemplateCodeList" :key="item.code">{{ item.name }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item
        label="内容"
        prop="data"
      >
        <a-textarea :rows="4" v-model="form.data" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="备注"
        prop="remark"
      >
        <a-input v-model="form.remark" :disabled="showable"/>
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
import { add, get, update, existsByCode, existsByCodeNotId } from '@/api/notice/messageTemplate'

export default {
  name: 'TemplateEdit',
  mixins: [FormMixin],
  data () {
    return {
      MessageTemplateCode: 'MessageTemplateCode',
      messageTemplateCodeList: [],
      form: {
        code: '',
        name: '',
        date: '',
        remark: '',
        type: 1
      },
      rules: {
        code: [
          { required: true, message: '请输入模板编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入模板名称' }
        ],
        date: [
          { required: true, message: '请数据模板数据' }
        ],
        type: [
          { required: true, message: '请选择模板类型' }
        ]
      }
    }
  },
  methods: {
    edit (id, type) {
      this.messageTemplateCodeList = this.getDictItemsByNumber(this.MessageTemplateCode)
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
    // 验证字典编码
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
