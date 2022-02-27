<template>
  <a-modal
    v-model="visible"
    title="扫码支付"
    @cancel="handleCancel"
    :footer="null"
    :width="350">
    <div style="display: flex; flex-direction: column;align-items: center">
      <vue-qr
        :logo-src="logoSrc"
        :size="190"
        :margin="0"
        :auto-color="true"
        :dot-scale="1"
        :text="qrUrl" />
      <div style="padding-top: 20px;  display: flex; flex-direction: row;align-items: center;justify-content: center">
        <img style="width: 25px;padding-right: 5px;" :src="icon"/>
        {{ bottomTitle }}
      </div>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'CashierQrCode',
  data () {
    return {
      visible: false,
      icon: '',
      bottomTitle: '',
      qrUrl: ''
    }
  },
  methods: {
    init (qrUrl, icon, bottomTitle) {
      this.visible = true
      this.qrUrl = qrUrl
      this.icon = icon
      this.bottomTitle = bottomTitle
    },
    handleCancel () {
      this.visible = false
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped>

</style>
