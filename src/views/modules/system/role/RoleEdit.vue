<template>
  <a-modal
    title="角色管理"
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
          label="角色名称"
          prop="name"
        >
          <a-input
            :disabled="showable"
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item
          label="角色代码"
          prop="code"
        >
          <a-input
            :disabled="showable"
            v-model="form.code"
          />
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
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { get, add, update, existsByCode, existsByCodeNotId, existsByName, existsByNameNotId } from '@/api/system/role'
import { FormMixin } from '@/mixins/FormMixin'
export default {
  name: 'RoleEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: '',
        name: '',
        code: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称' },
          { validator: this.validateName, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色代码' },
          { validator: this.validateCode, trigger: 'blur' }
        ]
      },
      treeData: []
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
