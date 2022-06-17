<template>
  <a-dropdown v-if="currentUser && currentUser.name" placement="bottomRight">
    <span class="ant-pro-account-avatar">
      <a-avatar
        ref="aa"
        size="small"
        :src="avatarUrl||defaultAvatar"
        class="antd-pro-global-header-index-avatar" />
      <span style="margin-right: 5px;">{{ currentUser.name }}</span>
<!--      <setting-drawer ref="settingDrawer" title="系统设置"/>-->
    </span>
    <template v-slot:overlay>
      <a-menu class="ant-pro-drop-down menu" :selected-keys="[]">
        <a-menu-item v-if="menu" key="userSettings" @click="handleToUserSettings">
          <a-icon type="setting" />
          个人设置
        </a-menu-item>
<!--        <a-menu-item v-if="menu" key="systemSettings" @click="handleToSystemSettings">-->
<!--          <a-icon type="tool" />-->
<!--          系统设置-->
<!--        </a-menu-item>-->
        <a-menu-divider v-if="menu" />
        <a-menu-item key="logout" @click="handleLogout">
          <a-icon type="logout" />
          退出
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
  <span v-else>
    <a-spin size="small" :style="{ marginLeft: 8, marginRight: 8 }" />
  </span>
</template>

<script>
import { Modal } from 'ant-design-vue'
import SettingDrawer from '@/components/SettingDrawer/SettingDrawer'

export default {
  name: 'AvatarDropdown',
  components: {
    SettingDrawer
  },
  props: {
    currentUser: {
      type: Object,
      default: () => null
    },
    avatarUrl: {
      type: String,
      default: () => null
    },
    menu: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      defaultAvatar: '/avatar2.jpg'
    }
  },
  methods: {
    handleToCenter () {
      this.$router.push({ path: '/account/center' })
    },
    handleToUserSettings () {
      this.$router.push({ path: '/account/settings' })
    },
    handleToSystemSettings () {
      this.$refs.settingDrawer.showDrawer()
    },
    handleLogout (e) {
      Modal.confirm({
        title: '信息',
        content: '您确定要注销退出吗？',
        onOk: () => {
          return this.$store.dispatch('Logout').then(() => {
            this.$router.push({ name: 'login' })
          })
        },
        onCancel () {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ant-pro-drop-down {
  /deep/ .action {
    margin-right: 8px;
  }
  /deep/ .ant-dropdown-menu-item {
    min-width: 160px;
  }
}
</style>
