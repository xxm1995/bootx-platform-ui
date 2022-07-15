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
      :column="{md: 2, sm: 1, xs: 1}"
    >
      <a-descriptions-item label="用户id">
        {{ form.userId }}
      </a-descriptions-item>
      <a-descriptions-item label="标题">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="业务id">
        {{ form.businessId }}
      </a-descriptions-item>
      <a-descriptions-item label="金额">
        {{ form.amount }}
      </a-descriptions-item>
      <a-descriptions-item label="可退余额">
        {{ form.refundableBalance }}
      </a-descriptions-item>
      <a-descriptions-item label="支付状态">
        {{ dictConvert('PayStatus',form.payStatus) }}
      </a-descriptions-item>
      <a-descriptions-item label="是否是异步支付">
        {{ form.asyncPayMode?'是':'否' }}
      </a-descriptions-item>
      <a-descriptions-item label="异步支付方式">
        {{ dictConvert('PayChannel',form.asyncPayChannel) }}
      </a-descriptions-item>
      <a-descriptions-item label="支付信息">
        <a-tag v-for="o in form.payChannelInfo" :key="o.payChannel">{{ dictConvert('PayChannel',o.payChannel) }}: {{ o.amount }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="可退款信息">
        <a-tag v-for="o in form.refundableInfo" :key="o.payChannel">{{ dictConvert('PayChannel',o.payChannel) }}: {{ o.amount }}</a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="客户IP">
        {{ form.clientIp }}
      </a-descriptions-item>
      <a-descriptions-item label="描述">
        {{ form.description }}
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
import { get } from '@/api/payment/payment'
export default {
  name: 'PaymentInfo',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: '',
        userId: '',
        businessId: '',
        amount: '',
        refundableBalance: '',
        payStatus: '',
        title: '',
        clientIp: '',
        description: '',
        errorCode: '',
        asyncPayMode: '',
        asyncPayChannel: '',
        payChannelInfo: '',
        refundableInfo: '',
        payTime: '',
        expiredTime: ''
      }
    }
  },
  methods: {
    edit (id) {
      this.confirmLoading = true
      get(id).then(res => {
        this.form = res.data
        console.log(this.form)
        this.confirmLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
