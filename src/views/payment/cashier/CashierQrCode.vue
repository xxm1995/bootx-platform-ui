<template>
  <a-modal
    v-model="visible"
    title="扫码支付"
    @cancel="handleCancel"
    :footer="null"
    :width="250">
    <div style="display: flex; flex-direction: column;align-items: center">
      <vue-qr
        :size="190"
        :margin="0"
        :auto-color="true"
        :dot-scale="1"
        :text="qrUrl" />
      <div style="padding-top: 20px;  display: flex; flex-direction: row;align-items: center;justify-content: center">
        {{ bottomTitle }}
      </div>
    </div>
  </a-modal>
</template>

<script>
import VueQr from 'vue-qr'

export default {
  name: 'CashierQrCode',
  components: {
    VueQr
  },
  data () {
    return {
      visible: false,
      icon: '',
      bottomTitle: '',
      qrUrl: ''
    }
  },
  methods: {
    init (qrUrl, bottomTitle) {
      this.visible = true
      this.qrUrl = qrUrl
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
