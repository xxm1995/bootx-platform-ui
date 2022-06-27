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
          label="编码"
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
          label="是否系统内置"
          prop="system"
        >
          <a-input v-model="form.system" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="是否可用"
          prop="enable"
        >
          <a-input v-model="form.enable" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="关联终端"
          prop="clientIds"
        >
          <a-input v-model="form.clientIds" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="description"
        >
          <a-input v-model="form.description" :disabled="showable"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, add, update } from '@/api/system/application'
export default {
  name: 'ApplicationEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        code: null,
        name: null,
        system: null,
        enable: null,
        clientIds: null,
        description: null,
      },
      rules: {

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
    }
  }
}
</script>

<style scoped>

</style>
