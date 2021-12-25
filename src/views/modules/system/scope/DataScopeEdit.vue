<template>
  <a-modal
    title="数据范围权限管理"
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
          <a-input
            :disabled="showable"
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item
          label="编码"
          prop="code"
        >
          <a-input
            :disabled="showable"
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item
          label="权限范围"
          prop="type"
        >
          <a-radio-group
            :disabled="!addable"
            v-model="form.type"
          >
            <a-radio :value="1">自身数据</a-radio>
            <a-radio :value="2">用户范围</a-radio>
            <a-radio :value="3">部门范围</a-radio>
            <a-radio :value="4">部门和用户范围</a-radio>
            <a-radio :value="5">全部数据</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="备注"
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
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, existsByCode, existsByCodeNotId, existsByName, existsByNameNotId, get, update } from '@/api/system/dataScope'

export default {
  name: 'DataScopeEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: '',
        name: '',
        type: 1,
        code: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入数据权限名称' },
          { validator: this.validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入数据权限编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择数据权限范围' }]
      }
    }
  },
  methods: {
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          const record = res.data
          this.confirmLoading = false
          this.form = record
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
    },
    async validateName (rule, value, callback) {
      const { name, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await existsByNameNotId(name, id)
      } else {
        res = await existsByName(name)
      }
      if (!res.data) {
        callback()
      } else {
        callback('该名称已存在!')
      }
    }
  }
}
</script>

<style scoped>

</style>
