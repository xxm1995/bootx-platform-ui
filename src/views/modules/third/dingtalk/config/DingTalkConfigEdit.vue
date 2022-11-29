<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
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
          label="名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="AppKey"
          prop="appKey"
        >
          <a-input v-model="form.appKey" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="AppSecret"
          prop="appSecret"
        >
          <a-textarea v-model="form.appSecret" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          v-if="!addable"
          label="是否启用"
          prop="enable"
        >
          <a-tag>{{ form.enable?'启用':'未启用' }}</a-tag>
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
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, add, update } from '@/api/third/dingTalkConfig'
export default {
  name: 'ConfigEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        name: null,
        appKey: null,
        appSecret: null,
        remark: null
      },
      rules: {
        name: [{ required: true, message: '名称不可为空' }],
        appKey: [{ required: true, message: 'AppKey不可为空' }],
        appSecret: [{ required: true, message: 'AppSecret不可为空' }]
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
            await update({ ...this.form, ...this.diffForm(this.rawForm, this.form, 'appKey', 'appSecret') })
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
