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
      <a-form-model-item
        label="字典编码"
        prop="dictCode"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :disabled="true"
          v-model="form.dictCode"
        />
      </a-form-model-item>
      <a-form-model-item
        label="字典项编码"
        prop="code"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :disabled="showable"
          v-model="form.code"
        />
      </a-form-model-item>
      <a-form-model-item
        label="字典项名称"
        prop="name"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :disabled="showable"
          v-model="form.name"
        />
      </a-form-model-item>
      <a-form-model-item
        label="描述"
        prop="remark"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input
          :disabled="showable"
          v-model="form.remark"
        />
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
import { itemGet, itemAdd, itemUpdate } from '@/api/system/dict'
export default {
  name: 'DictItemEdit',
  mixins: [FormMixin],
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      confirmLoading: false,
      form: {
        dictId: '',
        dictCode: '',
        code: '',
        name: '',
        remark: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入字典项编码', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字典项名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    edit (record, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        itemGet(record.id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
      } else {
        this.resetForm()
        this.$nextTick(() => {
          this.form.dictId = record.id
          this.form.dictCode = record.code
        })
      }
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await itemAdd(this.form)
          } else if (this.type === 'edit') {
            await itemUpdate(this.form)
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
        this.form = {}
      })
    }
  }
}
</script>

<style scoped>

</style>
