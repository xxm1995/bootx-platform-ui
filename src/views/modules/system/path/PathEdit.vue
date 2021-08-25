<template>
  <a-modal
    title="请求权限管理"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
    :footer="editable?footer:false"
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
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item
          label="请求路径"
          prop="path"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.path"
          />
        </a-form-model-item>
        <a-form-model-item
          label="请求方式"
          prop="method"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.method"
          />
        </a-form-model-item>
        <a-form-model-item
          label="服务名称"
          prop="serviceName"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.serviceName"
          />
        </a-form-model-item>
        <a-form-model-item
          label="公开接口"
          prop="publicAccess"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            :disabled="showTable"
            allowClear
            v-model="form.publicAccess">
            <a-select-option :key="true">是</a-select-option>
            <a-select-option :key="false">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="需要登录"
          prop="loginAccess"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            :disabled="showTable"
            allowClear
            v-model="form.loginAccess">
            <a-select-option :key="true">是</a-select-option>
            <a-select-option :key="false">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="内部接口"
          prop="within"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            :disabled="showTable"
            allowClear
            v-model="form.within">
            <a-select-option :key="true">是</a-select-option>
            <a-select-option :key="false">否</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="description"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.description"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer" v-if="editable">
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" v-if='!showable' :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
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
        path: '',
        method: '',
        serviceName: '',
        publicAccess: '',
        loginAccess: '',
        within: '',
        description: ''
      },
      rules: {
        code: [{ required: true, message: '必填' }],
        path: [{ required: true, message: '必填' }],
        method: [{ required: true, message: '必填' }],
        serviceName: [{ required: true, message: '必填' }],
        publicAccess: [{ required: true, message: '必填' }],
        loginAccess: [{ required: true, message: '必填' }],
        within: [{ required: true, message: '必填' }]
      }
    }
  },
  methods: {
    // 获取角色信息
    edit (id, type) {
      this.visible = true
      if (type && type === 'add') {
        this.addable = true
        this.type = type
        this.resetForm()
      }
      if (type === 'edit') {
        this.editable = true
        this.type = type
      }
      if (type === 'show') {
        this.showTable = true
        this.type = type
      }
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          const record = res.data
          this.dsType = record.dsType
          this.confirmLoading = false
          this.form = record
        })
      } else {
        this.dsType = '2'
      }
    },
    selectChange (e) {
      this.dsType = e
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
    handleCancel () {
      this.visible = false
      this.resetForm()
      setTimeout(() => {
        this.addable = false
        this.showTable = false
        this.editable = false
      }, 200)
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
