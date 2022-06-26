<template>
  <div>
    <div class="user-login-other">
      <span>其他登录方式</span>
      <a @click="onThirdLogin('dingtalk')" title="钉钉"><a-icon class="item-icon" type="dingding"></a-icon></a>
      <a @click="onThirdLogin('wechat_open')" title="微信"><a-icon class="item-icon" type="wechat"></a-icon></a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThirdLogin'
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
