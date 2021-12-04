<!--登陆页首页-->
<template>
  <div class="main">
    <div class="login-menu">
      <user-login
        @loginSuccess="loginSuccess"
        v-if="activeName === 'user'"/>
      <phone-login
        @loginSuccess="loginSuccess"
        v-if="activeName === 'phone'"/>
      <div style="text-align:center; width: 100%;">
        <a
          @click.stop="activeName='user'"
          href="javascript:">账号密码</a>
        <a
          @click.stop="activeName='phone'"
          href="javascript:">手机号登录</a>
      </div>
    </div>
  </div>
</template>

<script>
import userLogin from './UserLogin'
import phoneLogin from './PhoneLogin'
import { timeFix } from '@/utils/util'
export default {
  name: 'Index',
  components: {
    userLogin,
    phoneLogin
  },
  data () {
    return {
      socialForm: {},
      activeName: 'user'
    }
  },
  methods: {
    loginSuccess () {
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
    color: #999;
    font-size: 12px;
    margin: 0px 8px;
  }
}

.login-select {
  width: 100%;
  margin-bottom: 10px;

  input {
    color: #333;
    font-size: 18px;
    font-weight: 400;
    border: none;
    text-align: center;
  }
}

</style>
