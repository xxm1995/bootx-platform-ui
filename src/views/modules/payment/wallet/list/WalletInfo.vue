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
      <a-descriptions-item label="钱包ID">
        {{ form.id }}
      </a-descriptions-item>
      <a-descriptions-item label="账号ID">
        {{ form.userId }}
      </a-descriptions-item>
      <a-descriptions-item label="用户名称">
        {{ form.userName }}
      </a-descriptions-item>
      <a-descriptions-item label="钱包余额">
        {{ form.balance }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ dictConvert('WalletStatus',form.status) }}
      </a-descriptions-item>
    </a-descriptions>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { getWalletInfo } from '@/api/payment/wallet'

export default {
  name: 'WalletInfo',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        status: null,
        balance: null,
        userId: null,
        userName: null
      }
    }
  },
  methods: {
    edit (id) {
        this.confirmLoading = true
        getWalletInfo(id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
    }
  }
}
</script>

<style scoped>

</style>