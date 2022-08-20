// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './config/vxeTableConfig'
import './permission' // permission control
import './utils/filter' // global filter
import './assets/css/global.less' // global style
import './assets/css/components.less' // 组件样式 style

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

const vue = new Vue({
  router,
  store,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')

export default vue
