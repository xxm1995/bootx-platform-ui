<template>
  <div :class="wrpCls">
    <avatar-dropdown :menu="showMenu" :current-user="currentUser" :class="prefixCls" />
    <!--    <select-lang :class="prefixCls" />-->
  </div>
</template>

<script>
import AvatarDropdown from './AvatarDropdown'
import { getUserInfo } from '@/api/login/login'
// import SelectLang from '@/components/SelectLang'

export default {
  name: 'RightContent',
  components: {
    // SelectLang,
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
      currentUser: {}
    }
  },
  methods: {
    getCurrentUser () {
      getUserInfo().then(res => {
        this.currentUser = res.data
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
