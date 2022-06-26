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
          label="规格名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="规格类型"
          prop="type"
        >
          <a-select
            :disabled="showable"
            allowClear
            v-model="form.type"
            style="width: 100%"
            placeholder="选择规格类型">
            <a-select-option value="input">输入</a-select-option>
            <a-select-option value="select">列表选择</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="规格选项值"
          prop="options"
          v-if="form.type === 'select'"
        >
          <a-select
            mode="tags"
            :disabled="showable"
            style="width: 100%"
            v-model="form.options"
            placeholder="输入选项后按回车">
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="remark"
        >
          <a-input v-model="form.remark" :disabled="showable"/>
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
import { get, add, update } from '@/api/goods/specification'
export default {
  name: 'SpecificationEdit',
  mixins: [FormMixin],
  computed: {
      rules () {
        return {
          name: [
            { required: true, message: '请输入规格名称' },
            { validator: this.validateName, trigger: 'blur' }
          ],
          type: [{ required: true, message: '请选择规格类型' }],
          options: [{ required: this.form.type === 'select', message: '请输入参数选项' }]
        }
    }
  },
  data () {
    return {
      form: {
        id: null,
        name: '',
        type: 'input',
        options: [],
        remark: ''
      }
    }
  },
  methods: {
    edit (id, type) {
      this.form.options = undefined
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
    // 验证是否重复
    validateName (rule, value, callback) {
      callback()
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
