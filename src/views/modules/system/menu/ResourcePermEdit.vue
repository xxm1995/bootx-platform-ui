<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
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
          label="权限名称"
          prop="title"
        >
          <a-input
            :disabled="showable"
            v-model="form.title"
          />
        </a-form-model-item>
        <a-form-model-item
          label="权限编码"
          prop="permCode"
        >
          <a-input
            :disabled="showable"
            v-model="form.permCode"
          />
        </a-form-model-item>
        <a-form-model-item
          label="是否启用"
          prop="effect"
        >
          <a-switch
            :disabled="showable"
            checkedChildren="是"
            unCheckedChildren="否"
            v-model="form.effect"/>
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
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, existsByPermCode, existsByPermCodeNotId, get, update } from '@/api/system/permMenu'

export default {
  name: 'ResourcePermEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        parentId: null,
        title: '',
        permCode: '',
        effect: true,
        menuType: 2,
        sortNo: 0,
        remark: ''
      },
      rules: {
        parentId: [{ required: true, message: '数据非法' }],
        permCode: [
          { required: true, message: '请输入权限编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入权限名称' }
        ]
      }
    }
  },
  methods: {
    edit (record, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(record.id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
      } else {
        this.confirmLoading = false
        this.$nextTick(() => {
          this.form.parentId = record.id
        })
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
    // 验证权限编码
    async validateCode (rule, value, callback) {
      const { permCode, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await existsByPermCodeNotId(permCode, id)
      } else {
        res = await existsByPermCode(permCode)
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
