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
          label="参数名称"
          prop="name"
        >
          <a-input
            :disabled="showable"
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item
          label="参数键名"
          prop="paramKey"
        >
          <a-input
            :disabled="showable"
            v-model="form.paramKey"
          />
        </a-form-model-item>
        <a-form-model-item
          label="参数值"
          prop="value"
        >
          <a-input
            :disabled="showable"
            v-model="form.value"
          />
        </a-form-model-item>
        <a-form-model-item
          label="参数类型"
          prop="type"
        >
          <a-select
            allowClear
            style="width: 220px"
            :disabled="showable"
            v-model="form.type"
            placeholder="请选择状态"
          >
            <a-select-option v-for="o in paramTypeList" :key="o.code">{{ o.name }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          v-show="!addable"
          label="系统内置"
          prop="internal"
        >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.internal" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="备注"
          prop="remark"
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
import { FormMixin } from '@/mixins/FormMixin'
import { add, get, update, existsByKey, existsByKeyNotId } from '@/api/system/param'

export default {
  name: 'SystemParamEdit',
  mixins: [FormMixin],
  data () {
    return {
      paramType: 'ParamType',
      paramTypeList: [],
      form: {
        id: '',
        name: '',
        paramKey: '',
        value: '',
        type: 2,
        internal: false,
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '参数名称必填' }],
        paramKey: [
          { required: true, message: '参数键名必填' },
          { validator: this.validateKey, trigger: 'blur' }
        ],
        value: [{ required: true, message: '参数内容必填' }],
        type: [{ required: true, message: '参数类型必填' }]
      }
    }
  },
  methods: {
    edit (id, type) {
      this.paramTypeList = this.getDictItemsByNumber(this.paramType)
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
    async validateKey (rule, value, callback) {
      const { key, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await existsByKeyNotId(key, id)
      } else {
        res = await existsByKey(key)
      }
      if (!res.data) {
        callback()
      } else {
        callback('该参数键名已存在!')
      }
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
