<template>
  <div :class="wrpCls">
    <!--  使用用户菜单  -->
    <user-menu/>
  </div>
</template>

<script>
import UserMenu from '@/components/tools/UserMenu'

export default {
  name: 'RightContent',
  components: {
    UserMenu
  },
  props: {
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
  computed: {
    wrpCls () {
      return {
        'ant-pro-global-header-index-right': true,
        [`ant-pro-global-header-index-${(this.isMobile || !this.topMenu) ? 'light' : this.theme}`]: true
      }
    }
  }
}
</script>
