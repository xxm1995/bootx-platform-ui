<template>
  <div class="user-wrapper">
    <div class="content-box">
      <!--   菜单搜索   -->
      <menu-search/>
      <!--   切换全屏   -->
      <span class="action" @click="toggleFullscreen">
        <a-icon type="fullscreen-exit" v-if="isFullscreen"/>
        <a-icon type="fullscreen" v-else/>
      </span>
      <!--   消息通知   -->
      <notice-icon class="action"/>
      <!-- 消息查看组件 -->
      <notice-icon-reader ref="noticeIconReader"/>
      <!--   头像   -->
      <avatar-dropdown
        :menu="showMenu"
        :avatar-url="avatarUrl"
        :current-user="currentUser"
        class="ant-pro-global-header-index-action" />
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import NoticeIcon from '@/components/NoticeIcon'
import { message } from 'ant-design-vue/es'
import AvatarDropdown from './AvatarDropdown'
import MenuSearch from './MenuSearch'
import { mapActions } from 'vuex'
import store from '@/store'
import NoticeIconReader from '@/components/NoticeIcon/NoticeIconReader'

export default {
  name: 'UserMenu',
  components: {
    NoticeIconReader,
    NoticeIcon,
    MenuSearch,
    AvatarDropdown,
    screenfull
  },
  data () {
    return {
      isFullscreen: false,
      showMenu: true,
      currentUser: {},
      avatarUrl: ''
    }
  },
  methods: {
    ...mapActions(['GetUserInfo', 'GetUserAvatarUrl']),
    /**
     * 获取用户信息和头像
     */
    getCurrentUser () {
      const {
        GetUserInfo,
        GetUserAvatarUrl
      } = this
      GetUserInfo().then(res => {
        this.currentUser = res
        GetUserAvatarUrl(this.currentUser.avatar).then(res => {
          this.avatarUrl = res.data
        })
      }).catch(() => {
        // 获取用户信息失败时，调用登出
        store.dispatch('Logout').then(() => {
          this.$router.push({ name: 'login' })
        })
      })
    },
    /**
     * 全屏切换
     */
    toggleFullscreen () {
      if (!screenfull.isEnabled) {
        message.error('您的浏览器不支持全屏模式')
        return
      }
      screenfull.toggle()
      this.isFullscreen = !screenfull.isFullscreen
    }
  },
  mounted () {
    // 获取用户信息
    this.getCurrentUser()
  }
}
</script>

<style lang="less" scoped>

.action {
  padding: 0 14px;
  cursor:pointer;
}
</style>
