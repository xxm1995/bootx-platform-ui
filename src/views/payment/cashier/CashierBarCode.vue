<template>
  <a-modal
    v-model="visible"
    title="条码支付"
    @ok="handleOk"
    @cancel="handleCancel"
    :width="350">
    <div >
      <div style="margin-bottom:10px;display: flex; flex-direction: row;justify-content: start">
        {{ topTitle }}
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between">
        <a-input
          allowClear
          v-model="authCode"/>
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'CashierBarCode',
  data () {
    return {
      visible: false,
      topTitle: '',
      authCode: ''
    }
  },
  methods: {
    init (topTitle) {
      this.visible = true
      this.topTitle = topTitle
      this.authCode = ''
    },
    handleOk () {
      this.$emit('ok', this.authCode)
    },
    handleCancel () {
      this.visible = true
    }
  }
}
</script>

<style scoped>

</style>
