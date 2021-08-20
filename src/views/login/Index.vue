<!--登陆页首页-->
<template>
  <div class="main">
    <div class="login-menu">
      <user-login v-if="activeName === 'user'"></user-login>
      <phone-login v-if="activeName === 'phone'"></phone-login>
      <a
        @click.stop="activeName='user'"
        href="#">账号密码</a>
      <a
        @click.stop="activeName='phone'"
        href="#">手机号登录</a>
    </div>
  </div>
</template>

<script>
import userLogin from './UserLogin'
import phoneLogin from './PhoneLogin'
import { validatenull } from '@/utils/validate'
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
  watch: {
    $route: {
      handler () {
        const params = this.$route.query
        if (validatenull(params.state) && validatenull(params.code)) return
        this.socialForm.state = params.state
        this.socialForm.code = params.code
        this.$store.dispatch('LoginBySocial', this.socialForm).then(() => {
          this.$router.push({ name: 'dashboard' })
          // 延迟 1 秒显示欢迎信息
          setTimeout(() => {
            this.$notification.success({
              message: '欢迎',
              description: `${timeFix()}，欢迎回来`
            })
          }, 1000)
        })
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
  .login-menu {
    margin-top: 40px;
    width: 100%;
    text-align: center;

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
