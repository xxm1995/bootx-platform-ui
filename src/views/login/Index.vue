<!--登陆页首页-->
<template>
  <div class="main">
    <div class="login-menu">
      <a-spin :spinning="loading" :tip="loadingTip">
        <a-tabs :activeKey="activeName" @change="handleTabClick">
          <a-tab-pane key="user" tab="账号密码登录">
            <user-login
              @loginSuccess="loginSuccess"
              v-if="activeName === 'user'"/>
          </a-tab-pane>
          <a-tab-pane key="phone" tab="手机登录">
            <phone-login
              @loginSuccess="loginSuccess"
              v-if="activeName === 'phone'"/>
          </a-tab-pane>
          <a-tab-pane key="qrcode" tab="扫码登录">
            <qr-code-login
              @loginSuccess="loginSuccess"
              v-if="activeName === 'qrcode'"/>
          </a-tab-pane>
        </a-tabs>
        <a-row class="" style="display: flex; width: 100%;line-height: 22px;">
          <a-col :span="16" style="justify-content:flex-start" >
            <third-login
              @loginSuccess="loginSuccess"
              @loginLoading="loginLoading"
            />
          </a-col>
          <a-col :span="8" style="justify-content:flex-end">
            <router-link :to="{ name: 'register'}">
              注册
            </router-link>
            <router-link :to="{ name: 'forget'}">
              忘记密码
            </router-link>
          </a-col>
        </a-row>
      </a-spin>
    </div>
  </div>
</template>

<script>
import userLogin from './UserLogin'
import phoneLogin from './PhoneLogin'
import QrCodeLogin from './QrCodeLogin'
import ThirdLogin from './third/ThirdLogin'
import { timeFix } from '@/utils/util'
export default {
  name: 'Index',
  components: {
    userLogin,
    phoneLogin,
    QrCodeLogin,
    ThirdLogin
  },
  data () {
    return {
      loading: false,
      loadingTip: '登录中...',
      activeName: 'user'
    }
  },
  methods: {
    /**
     * 切换登录方式
     */
    handleTabClick (key) {
      this.activeName = key
    },

    /**
     * 登状状态
     */
    loginLoading (loading) {
      this.loading = loading
    },
    /**
     * 登录成功
     */
    loginSuccess () {
      this.loading = false
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      return this.$router.push({ name: 'Welcome' })
    }
  }
}
</script>

<style lang="less" scoped>
.login-menu {
  margin-top: 40px;
  width: 100%;
  //text-align: left;
  a {
    font-size: 14px;
    margin: 0 8px;
  }
}

.login-select {
  width: 100%;
  margin-bottom: 5px;

  input {
    color: #333;
    font-size: 18px;
    font-weight: 400;
    border: none;
    text-align: center;
  }
}

</style>
