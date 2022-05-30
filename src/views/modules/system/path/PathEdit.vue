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
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.id" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item hidden prop="id">
          <a-input hidden v-model="form.id"/>
        </a-form-model-item>
        <a-form-model-item hidden prop="generate">
          <a-switch hidden v-model="form.generate"/>
        </a-form-model-item>
        <a-form-model-item
          label="请求路径"
          prop="path"
        >
          <a-input
            :disabled="showable||form.generate"
            v-model="form.path"
          />
        </a-form-model-item>
        <a-form-model-item
          label="请求类型"
          prop="requestType"
        >
          <a-select
            v-model="form.requestType"
            :disabled="showable||form.generate"
          >
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
          </a-select>
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
          label="权限标识"
          prop="code"
        >
          <a-input
            :disabled="showable"
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item
          label="分组名称"
          prop="groupName"
        >
          <a-input
            :disabled="showable"
            v-model="form.groupName"
          />
        </a-form-model-item>
        <a-form-model-item
          label="启用鉴权"
          prop="enable"
        >
          <a-switch checked-children="开" un-checked-children="关" v-model="form.enable" :disabled="showable" />
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="remark"
        >
          <a-textarea
            :disabled="showable"
            v-model="form.remark"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" v-if="!showable" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/system/permPath'
import { FormMixin } from '@/mixins/FormMixin'
export default {
  name: 'PathEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        code: '',
        name: '',
        groupName: '',
        path: '',
        requestType: 'GET',
        enable: true,
        generate: false,
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请求权限编码必填' }],
        name: [{ required: true, message: '请求权限名称必填' }],
        requestType: [{ required: true, message: '请求类型必填' }],
        path: [{ required: true, message: '请求路径必填' }],
        enable: [{ required: true, message: '启用鉴权必选' }]
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
