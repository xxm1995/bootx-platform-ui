<template>
  <a-modal
    title="商户"
    :width="640"
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
        <span v-if="type !== 'add'">
          <a-form-model-item
            label="商户号"
            prop="merchantNo"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              disabled
              v-model="form.merchantNo"
            />
          </a-form-model-item>
        </span>
        <a-form-model-item
          label="商户名称"
          prop="merchantName"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.merchantName"
          />
        </a-form-model-item>
        <a-form-model-item
          label="联系人姓名"
          prop="contactName"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.contactName"
          />
        </a-form-model-item>
        <a-form-model-item
          label="手机号"
          prop="phone"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.phone"
          />
        </a-form-model-item>
        <a-form-model-item
          label="邮箱"
          prop="email"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.email"
          />
        </a-form-model-item>
        <a-form-model-item
          label="状态"
          prop="state"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            :disabled="showTable"
            allowClear
            v-model="form.state">
            <a-select-option :key="1">启用</a-select-option>
            <a-select-option :key="0">停用</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="备注"
          prop="remark"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.remark"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { get, add, update } from '@/api/payment/paymentList'

export default {
  name: 'PaymentEdit',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      form: {
        merchantNo: '',
        merchantName: '',
        contactName: '',
        phone: '',
        email: '',
        title: '',
        remark: ''
      },
      rules: {
        merchantName: [
          { required: true, message: '请输入商户名称' }
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名' }
        ],
        state: [
          { required: true, message: '请输入商户状态' }
        ]

      },
      type: 'add',
      editable: false,
      addable: false,
      showTable: false,
      dsType: '2',
      treeData: []
    }
  },
  methods: {
    // 获取角色信息
    edit (id, type) {
      console.log(id)
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
      })
    }
  }
}
</script>

<style scoped>

</style>