<template>
  <div class="main">
    <keep-alive :include="includedComponents">
      <router-view v-if="keepAlive" />
    </keep-alive>
    <router-view v-if="!keepAlive" />
  </div>
</template>

<script>
import Vue from 'vue'
import { CACHE_MULTI_TAB_COMPONENTS } from '@/store/mutation-types'

export default {
  name: 'RouteView',
  computed: {
    includedComponents () {
      const includedComponents = Vue.ls.get(CACHE_MULTI_TAB_COMPONENTS)
      // 如果是缓存路由，则加入到缓存
      if (this.$route.meta.keepAlive && this.$route.meta.componentName) {
        const cacheComponents = Vue.ls.get(CACHE_MULTI_TAB_COMPONENTS) || []
        if (!cacheComponents.includes(this.$route.meta.componentName)) {
          cacheComponents.push(this.$route.meta.componentName)
          Vue.ls.set(CACHE_MULTI_TAB_COMPONENTS, cacheComponents)
          return cacheComponents
        }
      }
      return includedComponents
    },
    keepAlive () {
      return this.$route.meta.keepAlive
    }
  }
}
</script>
