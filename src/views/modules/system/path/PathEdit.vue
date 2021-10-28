<template>
  <a-modal
    title="请求权限管理"
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
        <a-form-model-item
          label="权限标识"
          prop="code"
        >
          <a-input
            :disabled="showable"
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item
          label="权限名称"
          prop="name"
        >
          <a-input
            :disabled="showable"
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item
          label="启用状态"
          prop="enable"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-switch checked-children="开" un-checked-children="关" v-model="form.enable" :disabled="showable" />
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="description"
        >
          <a-input
            :disabled="showable"
            v-model="form.description"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer" v-if="editable">
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" v-if="!showable" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/system/path'
import { FormMixin } from '@/mixins/FormMixin'
export default {
  name: 'PathEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: '',
        code: '',
        name: '',
        enable: true,
        description: ''
      },
      rules: {
        code: [{ required: true, message: '请求权限编码必填' }],
        name: [{ required: true, message: '请求权限名称必填' }],
        enable: [{ required: true, message: '描述必填' }]
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
