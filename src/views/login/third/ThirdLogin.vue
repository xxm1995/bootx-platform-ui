<template>
  <div>
    <div class="user-login-other">
      <span>第三方登录:</span>
      <a @click="onThirdLogin(DING_TALK)" title="钉钉"><a-icon class="item-icon" type="dingding"></a-icon></a>
      <a @click="onThirdLogin(WE_COM)" title="企业微信"><icon-font class="item-icon" type="wecom"></icon-font></a>
      <a @click="onThirdLogin(WE_CHAT)" title="微信"><a-icon class="item-icon" type="wechat"></a-icon></a>
    </div>
  </div>
</template>

<script>
import { WE_CHAT, DING_TALK, WE_COM } from './OpenIdLoginType'
import { mapActions } from 'vuex'
import { Icon } from 'ant-design-vue'

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '/icons/weCom.js'
})
export default {
  name: 'ThirdLogin',
  components: {
    IconFont
  },
  data () {
    return {
      DING_TALK,
      WE_CHAT,
      WE_COM,
      client: '',
      currentLoginType: null
    }
  },
  methods: {
    ...mapActions(['loginOpenId']),
    /**
     * 调起登录
     */
    onThirdLogin (loginTpe) {
      this.currentLoginType = loginTpe
      const url = process.env.VUE_APP_API_BASE_URL + `/auth/third/toLoginUrl/${loginTpe}`
      window.open(url, `login ${loginTpe}`, 'height=600, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
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
        client: this.client,
        loginType: this.currentLoginType,
        ...data
      }).then(() => this.$emit('loginSuccess'))
        .finally(() => this.$emit('loginLoading', false))
    }
  },
  mounted () {
    this.client = process.env.VUE_APP_CLIENT
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
