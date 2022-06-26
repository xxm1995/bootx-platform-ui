<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-descriptions
      title=""
      :column="{md: 1, sm: 1, xs: 1}"
    >
      <a-descriptions-item label="付款记录ID">
        {{ form.paymentId }}
      </a-descriptions-item>
      <a-descriptions-item label="业务ID">
        {{ form.businessId }}
      </a-descriptions-item>
      <a-descriptions-item label="多次退款业务号">
        {{ form.refundRequestNo }}
      </a-descriptions-item>
      <a-descriptions-item label="标题">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="退款金额">
        {{ form.amount }}
      </a-descriptions-item>
      <a-descriptions-item label="剩余可退款金额">
        {{ form.refundableBalance }}
      </a-descriptions-item>
      <a-descriptions-item label="退款时间">
        {{ form.refundTime }}
      </a-descriptions-item>
      <a-descriptions-item label="退款终端ip">
        {{ form.clientIp }}
      </a-descriptions-item>
      <a-descriptions-item label="退款信息">
        <a-tag v-for="o in form.refundableInfoList" :key="o.payChannel">{{ dictConvert('PayChannel',o.payChannel) }}: {{ o.amount }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="错误码">
        {{ form.errorCode }}
      </a-descriptions-item>
      <a-descriptions-item label="错误信息">
        {{ form.errorMsg }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import { FormMixin } from '@/mixins/FormMixin'
  import { get } from '@/api/payment/refundRecord'
  export default {
    name: 'RefundRecordInfo',
    mixins: [FormMixin],
    data () {
      return {
        form: {
          id: null,
          refundOrderId: null,
          paymentId: null,
          refundRequestNo: null,
          userId: null,
          title: null,
          amount: null,
          refundableInfo: null,
          refundableInfoList: [],
          refundStatus: null,
          refundTime: null,
          clientIp: null,
          errorCode: null,
          errorMsg: null
        }
      }
    },
    methods: {
      edit (id, type) {
          this.confirmLoading = true
          get(id).then(res => {
            this.form = res.data
            this.confirmLoading = false
          })
      }
    }
  }
</script>

<style scoped>

</style>
