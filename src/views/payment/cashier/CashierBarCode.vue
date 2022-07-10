<template>
  <a-modal
    v-model="visible"
    title="条码支付"
    :width="350">
    <a-spin :spinning="loading">
      <div>
        <div style="margin-bottom:10px;display: flex; flex-direction: row;justify-content: start">
          {{ topTitle }}
        </div>
        <div style="display: flex;flex-direction: row;justify-content: space-between">
          <a-input
            allowClear
            v-model="authCode"/>
        </div>
      </div>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="loading" type="primary" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'CashierBarCode',
  data () {
    return {
      visible: false,
      loading: false,
      topTitle: '',
      authCode: ''
    }
  },
  methods: {
    init (topTitle) {
      this.visible = true
      this.loading = false
      this.topTitle = topTitle
      this.authCode = ''
    },
    handleOk () {
      this.loading = true
      this.$emit('ok', this.authCode)
    },
    handleCancel () {
      this.handleClose()
      this.$emit('cancel')
    },
    handleClose () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
