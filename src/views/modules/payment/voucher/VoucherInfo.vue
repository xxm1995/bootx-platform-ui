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
      bordered
      title=""
      :column="{md: 1, sm: 1, xs: 1}"
    >
      <a-descriptions-item label="卡号">
        {{ form.cardNo }}
      </a-descriptions-item>
      <a-descriptions-item label="生成批次号">
        {{ form.batchNo }}
      </a-descriptions-item>
      <a-descriptions-item label="面值">
        {{ form.faceValue }}
      </a-descriptions-item>
      <a-descriptions-item label="余额">
        {{ form.balance }}
      </a-descriptions-item>
      <a-descriptions-item label="有效期">
        {{ form.enduring?'长期':'期限' }}
      </a-descriptions-item>
      <a-descriptions-item label="开始时间">
        {{ form.startTime }}
      </a-descriptions-item>
      <a-descriptions-item label="结束时间">
        {{ form.endTime }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get } from '@/api/payment/voucher'

export default {
  name: 'VoucherInfo',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        cardNo: null,
        batchNo: null,
        faceValue: null,
        balance: null,
        enduring: null,
        startTime: null,
        endTime: null,
        status: null
      }
    }
  },
  methods: {
    edit (id) {
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
