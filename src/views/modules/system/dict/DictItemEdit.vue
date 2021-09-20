<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
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
        prop="dictCode"
      >
        <a-input
          :disabled="true"
          v-model="form.dictCode"
        />
      </a-form-model-item>
      <a-form-model-item
        label="字典项编码"
        prop="code"
      >
        <a-input
          :disabled="showable"
          v-model="form.code"
        />
      </a-form-model-item>
      <a-form-model-item
        label="字典项名称"
        prop="name"
      >
        <a-input
          :disabled="showable"
          v-model="form.name"
        />
      </a-form-model-item>
      <a-form-model-item
        v-show="wrapperCol"
        prop="sortNo"
        label="排序">
        <a-input-number
          placeholder="请输入字典项排序，可以是小数"
          :disabled="showable"
          v-model="form.sortNo"
          style="width: 200px"
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
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { itemGet, itemAdd, itemUpdate, itemExistsByCode, itemExistsByCodeNotId } from '@/api/system/dict'
export default {
  name: 'DictItemEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        dictId: '',
        dictCode: '',
        code: '',
        name: '',
        sortNo: 0,
        remark: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入字典项编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入字典项名称' }
        ]
      }
    }
  },
  methods: {
    edit (record, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        itemGet(record.id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
      } else {
        this.confirmLoading = false
        this.$nextTick(() => {
          this.form.dictId = record.id
          this.form.dictCode = record.code
        })
      }
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await itemAdd(this.form)
          } else if (this.type === 'edit') {
            await itemUpdate(this.form)
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
      const { code, dictId, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await itemExistsByCodeNotId(code, dictId, id)
      } else {
        res = await itemExistsByCode(code, dictId)
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
