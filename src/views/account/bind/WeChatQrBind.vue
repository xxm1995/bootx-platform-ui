<template>
  <a-modal
    v-model="visible"
    title="扫码绑定"
    @cancel="handleCancel"
    :maskClosable="false"
    :footer="null"
    :width="250">
    <a-spin :spinning="loading">
      <vue-qr
        :size="200"
        :margin="0"
        :auto-color="true"
        :dot-scale="1"
        :text="qrCodeUrl" />
    </a-spin>
  </a-modal>
</template>

<script>
import { applyQrCode, getQrStatus } from '@/api/login/login'
import VueQr from 'vue-qr'
import { bindThird } from '@/api/system/user'

export default {
  name: 'WeChatQrBind',
  components: { VueQr },
  data () {
    return {
      visible: false,
      loading: false,
      form: {
        client: '',
        loginType: 'weChat',
        authCode: ''
      },
      qrCodeUrl: '请稍等'
    }
  },
  methods: {
    init () {
      this.visible = true
      this.applyQrCode()
    },
    /**
     * 获取
     */
    applyQrCode () {
      this.loading = true
      applyQrCode().then(res => {
        this.form.authCode = res.data.qrCodeKey
        this.qrCodeUrl = res.data.qrCodeUrl
        this.loading = false
        this.checkQrScanStatus()
      })
    },
    /**
     * 定时查询扫码情况
     */
    checkQrScanStatus () {
      this.interval = setInterval(() => {
        getQrStatus(this.form.authCode).then(res => {
          // 成功 进行绑定
          if (res.data === 'ok') {
            this.bindWeChat()
          } else if (res.data === 'expired') {
            clearInterval(this.interval)
            this.interval = null
            this.applyQrCode()
          }
        })
      }, 1000)
    },
    /**
     * 绑定
     */
    bindWeChat () {
      const form = {
        authCode: this.form.authCode,
        clientCode: this.form.loginType
      }
      this.$emit('bind', form)
      this.handleCancel()
    },
    /**
     * 关闭
     */
    handleCancel () {
      clearInterval(this.interval)
      this.interval = null
      this.visible = false
    }
  },
  destroyed () {
    this.handleCancel()
  }
}
</script>

<style scoped>

</style>
