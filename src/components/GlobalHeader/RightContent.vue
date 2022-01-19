<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :avatar-url="avatarUrl" :current-user="currentUser" :class="prefixCls" />
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import { mapActions } from 'vuex'

export default {
  name: 'RightContent',
  components: {
    AvatarDropdown
  },
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-global-header-index-action'
    },
    isMobile: {
      type: Boolean,
      default: () => false
    },
    topMenu: {
      type: Boolean,
      required: true
    },
    theme: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      showMenu: true,
      currentUser: {},
      avatarUrl: ''
    }
  },
  methods: {
    ...mapActions(['GetUserInfo', 'GetUserAvatarUrl']),
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
      })
    }
  },
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  },
  mounted () {
    this.getCurrentUser()
  }
}
</script>
