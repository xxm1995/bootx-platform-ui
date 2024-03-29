<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    v-bind="settings"
  >
    <!-- 1.0.0+ 版本 pro-layout 提供 API，
          我们推荐使用这种方式进行 LOGO 和 title 自定义
    -->
    <template #menuHeaderRender>
      <div class="menuHeaderRender">
<!--                <logo-svg />-->
        <h1>{{ title }}</h1>
      </div>
    </template>
    <!-- 1.0.0+ 版本 pro-layout 提供 API,
          增加 Header 左侧内容区自定义
    -->
    <template #headerContentRender>
      <div>
<!--        <a-tooltip title="刷新字典缓存">-->
<!--          <a-icon type="reload" style="font-size: 18px;cursor: pointer;" @click="RefreshDictList" />-->
<!--        </a-tooltip>-->
      </div>
    </template>

    <template #rightContentRender>
      <!-- 后期添加菜单搜索功能 -->
      <right-content :top-menu="settings.layout === 'topmenu'" :is-mobile="isMobile" :theme="settings.theme" />
    </template>
    <!-- custom footer / 自定义Footer -->
    <template #footerRender>
      <global-footer />
    </template>
    <!--  多页签  -->
    <multi-tab v-if="multiTab"/>
    <!--  页面  -->
    <router-view :style="{marginTop: settings.fixedHeader&&multiTab?'42px':'0px'}"/>
  </pro-layout>
</template>

<script>
import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
import { mapActions, mapState } from 'vuex'
import {
  CACHE_MULTI_TAB_COMPONENTS,
  CONTENT_WIDTH_TYPE,
  SIDEBAR_TYPE,
  TOGGLE_MOBILE_TYPE
} from '@/store/mutation-types'

import MultiTab from '@/components/MultiTab'
import defaultSettings from '@/config/defaultSettings'
import RightContent from '@/components/GlobalHeader/RightContent'
import GlobalFooter from '@/components/GlobalFooter'
import LogoSvg from '../assets/img/logo.svg'
import storage from 'store'

export default {
  name: 'BasicLayout',
  components: {
    SettingDrawer,
    RightContent,
    MultiTab,
    GlobalFooter,
    LogoSvg
  },
  data () {
    return {
      // preview.pro.antdv.com only use.
      isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // end
      isDev: process.env.NODE_ENV === 'development' || process.env.VUE_APP_PREVIEW === 'true',

      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      title: defaultSettings.title,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      },
      // 媒体查询
      query: {},
      // 多标签
      multiTab: defaultSettings.multiTab,

      // 是否手机模式
      isMobile: false
    }
  },
  computed: {
    ...mapState({
      // 动态主路由
      mainMenu: state => state.permission.addRouters
    }),
    includedComponents () {
      const includedComponents = storage.get(CACHE_MULTI_TAB_COMPONENTS)
      // 如果是缓存路由，则加入到缓存
      if (this.$route.meta.keepAlive && this.$route.meta.componentName) {
        const cacheComponents = storage.get(CACHE_MULTI_TAB_COMPONENTS) || []
        if (!cacheComponents.includes(this.$route.meta.componentName)) {
          cacheComponents.push(this.$route.meta.componentName)
          storage.set(CACHE_MULTI_TAB_COMPONENTS, cacheComponents)
          return cacheComponents
        }
      }
      return includedComponents
    }
  },
  created () {
    this.initDictList()
    const routes = this.mainMenu.find(item => item.path === '/')
    this.menus = (routes && routes.children) || []
    // 处理侧栏收起状态
    this.$watch('collapsed', () => {
      this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    })
    this.$watch('isMobile', () => {
      this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    })
  },
  mounted () {
    const userAgent = navigator.userAgent
    if (userAgent.indexOf('Edge') > -1) {
      this.$nextTick(() => {
        this.collapsed = !this.collapsed
        setTimeout(() => {
          this.collapsed = !this.collapsed
        }, 16)
      })
    }

    // first update color
    // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
      updateTheme(this.settings.primaryColor)
    }
  },
  methods: {
    ...mapActions(['InitDictList']),
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
        this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    },
    handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    },
    // 初始化字典
    initDictList () {
      const {
        InitDictList
      } = this
      InitDictList()
    },
    // 刷新字典
    RefreshDictList () {
      this.$message.info('刷新中')
      const {
        InitDictList
      } = this
      InitDictList().then(() => {
        this.$message.destroy()
        this.$message.success('刷新缓存成功')
      }).catch(() => {
        this.$message.destroy()
        this.$message.error('刷新缓存失败')
      })
    }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
.menuHeaderRender{
  .headHeight()
}
.ant-menu{
  // 隐藏菜单栏滚动条
  &::-webkit-scrollbar
  {
    width: 0;
  }
}
</style>
