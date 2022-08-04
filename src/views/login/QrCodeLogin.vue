<template>
  <div style="display: flex; flex-direction: column;align-items: center;margin: 24px">
    <vue-qr
      :size="200"
      :margin="0"
      :auto-color="true"
      :dot-scale="1"
      :text="'尽请期待'" />
    <div style="padding-top: 24px; font-size: 18px;  display: flex; flex-direction: row;align-items: center;justify-content: center">
      请使用微信扫码
    </div>
  </div>

</template>

<script>
import VueQr from 'vue-qr'

export default {
  name: 'QrCodeLogin',
  components: {
    VueQr
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
