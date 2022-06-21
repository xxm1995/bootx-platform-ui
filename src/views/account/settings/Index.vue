<template>
  <div class="page-header-index-wide">
    <a-card :bordered="false" :bodyStyle="{ height: '100%' }" :style="{ height: '100%' }">
      <a-tabs
        default-active-key="1"
        tab-position="left"
        :tabBarStyle="{width:'150px'}">
        <a-tab-pane key="1" tab="基本设置">
          <basic-setting/>
        </a-tab-pane>
        <a-tab-pane key="2" tab="安全设置">
          <security/>
        </a-tab-pane>
        <a-tab-pane key="3" tab="账号绑定">
          <binding/>
        </a-tab-pane>
        <a-tab-pane key="4" tab="个人信息">
          <user-info/>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import { RouteView } from '@/layouts'
import { baseMixin } from '@/store/app-mixin'
import BasicSetting from '../base/BasicSetting'
import Binding from '../bind/Binding'
import UserInfo from './UserInfo'
import Security from '../security/Security'

export default {
  components: {
    RouteView,
    BasicSetting,
    Binding,
    UserInfo,
    Security
  },
  mixins: [baseMixin]
}
</script>

<style scoped>
</style>
