<template>
  <a-modal
    title="退款申请"
    :width="300"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <template v-for="o in form.refundModeParams" >
          <a-form-model-item
            :key="o.payChannel"
            :label="dictConvert('PayChannel',o.payChannel)"
            prop="name"
          >
            <a-input-number :min="0.01" :max="o.amount" :precision="2" v-model="o.amount"/>
          </a-form-model-item>
        </template>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get } from '@/api/payment/payment'
import { refund } from '@/api/payment/pay'

export default {
  name: 'RefundModel',
  mixins: [FormMixin],
  data () {
    return {
      // 订单
      payment: null,
      form: {
        businessId: null,
        // 可退款明细
        refundModeParams: []
      }
    }
  },
  methods: {
    edit (id) {
      this.confirmLoading = true
      get(id).then(({ data }) => {
        const { businessId, refundableInfo } = data
        this.form.businessId = businessId
        this.form.refundModeParams = [...refundableInfo]
        this.confirmLoading = false
      })
    },
    handleOk () {
      this.$confirm({
        title: '警告',
        content: '确实要申请退款',
        onOk: () => {
          this.confirmLoading = true
          refund(this.form).then(_ => {
            this.visible = false
            this.$emit('ok')
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
