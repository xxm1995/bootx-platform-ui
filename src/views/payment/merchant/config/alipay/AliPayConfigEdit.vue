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
        <a-form-model-item
          label="名称"
          prop="name"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.name"
          />
        </a-form-model-item>
        <span v-if="type !== 'add'">
          <a-form-model-item
            label="商户号"
            prop="merchantNo"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              :disabled="type !== 'add'"
              v-model="form.merchantNo"
            />
          </a-form-model-item>
        </span>
        <span v-if="type !== 'add'">
          <a-form-model-item
            label="应用ID"
            prop="appId"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input
              :disabled="type !== 'add'"
              v-model="form.appId"
            />
          </a-form-model-item>
        </span>
        <a-form-model-item
          label="支付宝AppId "
          prop="aliAppId"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.aliAppId"
          />
        </a-form-model-item>
        <a-form-model-item
          label="异步通知页面 "
          prop="notifyUrl"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.notifyUrl"
          />
        </a-form-model-item>
        <a-form-model-item
          label="同步通知页面 "
          prop="returnUrl"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.returnUrl"
          />
        </a-form-model-item>
        <a-form-model-item
          label="请求网关地址 "
          prop="serverUrl"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.serverUrl"
          />
        </a-form-model-item>
        <a-form-model-item
          label="支付宝公钥 "
          prop="alipayPublicKey"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.alipayPublicKey"
          />
        </a-form-model-item>
        <a-form-model-item
          label="签名类型 "
          prop="signType"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.signType"
          />
        </a-form-model-item>
        <a-form-model-item
          label="私钥 "
          prop="privateKey"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.privateKey"
          />
        </a-form-model-item>
        <a-form-model-item
          label="可用支付方式 "
          prop="payTypeList"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.payTypeList"
          />
        </a-form-model-item>
        <a-form-model-item
          label="是否沙箱环境"
          prop="sandbox"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            :disabled="showTable"
            allowClear
            v-model="form.sandbox">
            <a-select-option :key="true">是</a-select-option>
            <a-select-option :key="false">否</a-select-option>
          </a-select>
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
import { get, add, update } from '@/api/payment/payconfig/aliPayConfig'

export default {
  name: 'AliPayConfigEdit',
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
      form: {},
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