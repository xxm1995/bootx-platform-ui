<template>
  <div class="main">
    <keep-alive :include="includedComponents">
      <router-view/>
    </keep-alive>
  </div>
</template>

<script>
import { CACHE_MULTI_TAB_COMPONENTS } from '@/store/mutation-types'
import storage from 'store'

export default {
  name: 'RouteView',
  computed: {
    includedComponents () {
      // 如果是缓存路由，则加入到缓存
      if (this.$route.meta.keepAlive && this.$route.meta.componentName) {
        const cacheComponents = storage.get(CACHE_MULTI_TAB_COMPONENTS) || []
        // 多级路由下缓存中间路由
        for (const routeRecord of this.$route.matched) {
          const componentName = routeRecord.components.default.name
          if (!cacheComponents.includes(componentName)) {
            cacheComponents.push(componentName)
          }
        }
        // 是否包含当前路由
        if (!cacheComponents.includes(this.$route.meta.componentName)) {
          cacheComponents.push(this.$route.meta.componentName)
        }
        // 持久化
        storage.set(CACHE_MULTI_TAB_COMPONENTS, cacheComponents)
        if (cacheComponents) {
          return cacheComponents
        }
      }
      return storage.get(CACHE_MULTI_TAB_COMPONENTS) || []
    },
    keepAlive () {
      return this.$route.meta.keepAlive
    }
  }
}
</script>
