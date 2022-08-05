<template>
  <div style="display: flex; flex-direction: column;align-items: center;margin: 24px">
    <a-spin :spinning="loading">
      <vue-qr
        :size="200"
        :margin="0"
        :auto-color="true"
        :dot-scale="1"
        :text="qrCodeUrl" />
    </a-spin>
    <div style="padding-top: 24px; font-size: 18px;  display: flex; flex-direction: row;align-items: center;justify-content: center">
      请使用微信扫码
    </div>
  </div>

</template>

<script>
import VueQr from 'vue-qr'
import { applyQrCode, getQrStatus } from '@/api/login/login'
import { mapActions } from 'vuex'

export default {
  name: 'QrCodeLogin',
  components: { VueQr },
  watch: {
    initQrCode (newValue) {
      if (newValue) { this.applyQrCode() }
    }
  },
  props: {
    initQrCode: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 定时任务
      loading: false,
      getQrFlag: true,
      form: {
        client: '',
        loginType: 'weChat',
        authCode: ''
      },
      qrCodeUrl: '请稍等'
    }
  },
  methods: {
    ...mapActions(['Login']),
    /**
     * 获取
     */
    applyQrCode () {
      if (this.getQrFlag) {
        this.loading = true
        applyQrCode().then(res => {
          this.form.authCode = res.data.qrCodeKey
          this.qrCodeUrl = res.data.qrCodeUrl
          this.loading = false
          this.getQrFlag = false
          this.checkQrScanStatus()
        })
      }
    },
    /**
     * 定时查询扫码情况
     */
    checkQrScanStatus () {
      const { Login } = this
      this.interval = setInterval(() => {
        getQrStatus(this.form.authCode).then(res => {
          // 成功 进行登录
          if (res.data === 'ok') {
            this.$emit('loginLoading', true)
            Login(this.form)
              .then(() => {
                this.$emit('loginLoading', false)
                this.$emit('loginSuccess')
              })
              .finally(() => {
                clearInterval(this.interval)
              })
          } else if (res.data === 'expired') {
            this.getQrFlag = true
            this.applyQrCode()
            clearInterval(this.interval)
          }
        })
      }, 1000 * 3)
    }
  },
  created () {
    this.form.client = process.env.VUE_APP_CLIENT
  },
  destroyed () {
    clearInterval(this.interval)
    this.interval = null
  }
}
</script>

<style scoped>

</style>
