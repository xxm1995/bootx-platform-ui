<template>
  <a-card :bordered="false">
    <wx-menu-editor
      v-model="menu"
    />
  </a-card>
</template>

<script>
import WxMenuEditor from '@/components/WechatMenu/WxMenuEditor'

const getMenuAPI = 'https://hopex.github.io/vue-menu/test_menu.json'
export default {
  name: 'WeChatMenuEdit',
  components: { WxMenuEditor },
  data () {
    return {
      // 获取到菜单数据之前不可以传入空, 否则报错
      menu: {
        button: []
      }
    }
  },
  methods: {
    /**
     * 获取菜单内容
     */
    async getMenu () {
      try {
        const resp = await fetch(getMenuAPI)
        const res = await resp.json()
        this.menu = res.data.menu
        console.log(this.menu)
      } catch (err) {
        console.error(err)
        this.$message.error(err.message)
      }
    },
  },
  mounted() {
    // this.getMenu()
  }
}
</script>

<style scoped>

</style>
