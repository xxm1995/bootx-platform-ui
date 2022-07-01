<template>
  <div>
    <div class="user-login-other">
      <span>其他登录方式</span>
      <a @click="onThirdLogin(DING_TALK)" title="钉钉"><a-icon class="item-icon" type="dingding"></a-icon></a>
      <a @click="onThirdLogin(WE_COM)" title="微信"><a-icon class="item-icon" type="wechat"></a-icon></a>
    </div>
  </div>
</template>

<script>
import { WE_CHAT, DING_TALK, WE_COM } from './OpenIdLoginType'
import { mapActions } from 'vuex'
export default {
  name: 'ThirdLogin',
  data () {
    return {
      DING_TALK,
      WE_CHAT,
      WE_COM,
      application: '',
      currentClientCode: null
    }
  },
  methods: {
    ...mapActions(['loginOpenId']),
    /**
     * 调起登录
     */
    onThirdLogin (clientCode) {
      console.log()
      this.currentClientCode = clientCode
      const url = process.env.VUE_APP_API_BASE_URL + `/auth/third/toLoginUrl/${clientCode}`
      window.open(url, `login ${clientCode}`, 'height=600, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
      const that = this
      that.thirdType = clientCode
      // 监听回调
      window.addEventListener('message', this.authCodeCallback, false)
    },
    /**
     * 认证码回调
     */
    authCodeCallback (event) {
      // 回调后就进行解绑事件, 防止重复接收消息
      window.removeEventListener('message', this.authCodeCallback)
      const data = event.data
      // 登录
      const {
        loginOpenId
      } = this
      this.$emit('loginLoading', true)
      loginOpenId({
        application: this.application,
        client: this.currentClientCode,
        ...data
      }).then(() => this.$emit('loginSuccess'))
        .finally(() => this.$emit('loginLoading', false))
    }
  },
  created () {
    this.application = process.env.VUE_APP_APPLICATION
  }
}
</script>

<style lang="less" scoped>
.user-login-other {
  text-align: left;

  .item-icon {
    font-size: 24px;
    color: rgba(0, 0, 0, .2);
    margin-left: 16px;
    vertical-align: middle;
    cursor: pointer;
    transition: color .3s;

    &  :hover {
      color: #1890ff;
    }
  }
  .register {
    float: right;
  }
}
</style>
