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
          label="字典编码"
          prop="code"
        >
          <a-input
            :disabled="showable"
            v-model="form.code"
          />
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
          label="分类标签"
          prop="groupTag"
        >
          <a-input
            :disabled="showable"
            v-model="form.groupTag"
          />
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="remark"
        >
          <a-input
            :disabled="showable"
            v-model="form.remark"
          />
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
import { get, add, update, existsByCode, existsByCodeNotId } from '@/api/system/dict'
export default {
  name: 'DictEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        code: '',
        name: '',
        groupTag: '',
        remark: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入字典编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字典名称' }
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
