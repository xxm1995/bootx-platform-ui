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
      <a-descriptions-item label="业务ID">
        {{ form.refundRequestNo }}
      </a-descriptions-item>
      <a-descriptions-item label="标题">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="退款金额">
        {{ form.amount }}
      </a-descriptions-item>
      <a-descriptions-item label="退款时间">
        {{ form.refundTime }}
      </a-descriptions-item>
      <a-descriptions-item label="退款终端ip">
        {{ form.clientIp }}
      </a-descriptions-item>
      <a-descriptions-item label="退款信息">
        {{ form.refundableInfo }}
      </a-descriptions-item>
      <a-descriptions-item label="错误码">
        {{ form.errorCode }}
      </a-descriptions-item>
      <a-descriptions-item label="错误信息">
        {{ form.errorMsg }}
      </a-descriptions-item>
    </a-descriptions>
    <template v-slot:footer>
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
          refundStatus: null,
          refundTime: null,
          clientIp: null,
          errorCode: null,
          errorMsg: null
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
      }
    }
  }
</script>

<style scoped>

</style>
