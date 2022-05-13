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
          label="品牌名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="选择值(列表)"
          prop="options"
        >
          <a-input v-model="form.options" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="是否必填"
          prop="required"
        >
          <a-input v-model="form.required" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="排序"
          prop="sortNo"
        >
          <a-input v-model="form.sortNo" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="参数组id"
          prop="groupId"
        >
          <a-input v-model="form.groupId" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="类目id"
          prop="categoryId"
        >
          <a-input v-model="form.categoryId" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="remark"
        >
          <a-input v-model="form.remark" :disabled="showable"/>
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
import { get, add, update } from '@/api/goods/parameter'
export default {
  name: 'ParameterEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        name: null,
        options: null,
        required: null,
        sortNo: null,
        groupId: null,
        categoryId: null,
        remark: null,
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
