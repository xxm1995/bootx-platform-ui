<template>
  <a-config-provider :locale="zhCN">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/es/locale-provider/zh_CN'

export default {
  data () {
    return {
      zhCN
    }
  }
}
</script>
<style>
#app {
  height: 100%;
  min-width: 100%;
}
</style>
