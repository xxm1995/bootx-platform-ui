<template>
  <a-config-provider :locale="cn">
    <div id="app">
      <router-view/>
    </div>
  </a-config-provider>
</template>

<script>
import cn from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
  data () {
    return {
      cn
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
