<template>
  <span>
    <span class="action" @click="showClick">
      <a-icon type="search"></a-icon>
    </span>
    <component
      :is="searchMenuComp"
      v-show="searchMenuVisible"
      class="borders"
      title="搜索菜单"
      :footer="null">
      <a-select
        class="search-input"
        showSearch
        :showArrow="false"
        placeholder="搜索菜单"
        optionFilterProp="children"
        :filterOption="filterOption"
        :getPopupContainer="(node) => node.parentNode"
        @change="searchMethods"
      >
        <a-select-option v-for="(site,index) in searchMenuOptions" :key="index" :value="site.name">{{ site.meta.title }}</a-select-option>
      </a-select>
    </component>
  </span>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'MenuSearch',
  data () {
    return {
      avatarUrl: '',
      searchMenuOptions: [],
      searchMenuComp: 'span',
      searchMenuVisible: false

    }
  },
  computed: {
    ...mapState({
      // 菜单
      routerMenuList: state => state.permission.addRouters
    })
  },
  methods: {
    /**
     * 显示出来菜单的搜索
     */
    showClick () {
      this.searchMenuVisible = !this.searchMenuVisible
    },
    /**
     * 初始化菜单
     */
    initSearchMenus () {
      const lists = []
      this.searchMenusConvert(lists, this.routerMenuList)
      this.searchMenuOptions = [...lists]
    },
    /**
     * 转换菜单(递归)
     */
    searchMenusConvert (arr, menus) {
      for (const i of menus) {
        if (!i.hidden && i.component.name !== 'RouteView') {
          arr.push(i)
        }
        if (i.children && i.children.length > 0) {
          this.searchMenusConvert(arr, i.children)
        }
      }
    },
    /**
     * 菜单查询
     */
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    /**
     * 点击菜单
     */
    searchMethods (value) {
      this.searchMenuVisible = false
      const route = this.searchMenuOptions.filter(item => item.name === value)[0]
      console.log(route)
      if (route.meta.targetOutside) {
        window.open(route.meta.url)
      } else {
        this.$router.push({ path: route.path })
      }
    }
  },
  mounted () {
    // 获取菜单搜索信息
    this.initSearchMenus()
  }
}
</script>

<style lang="less" scoped>
.search-input{
  z-index: 199;
}
.action {
  padding: 0 14px;
  cursor:pointer;
}
.borders{
  padding-left: 5px;
}
.user-wrapper .search-input {
  width: 180px;
  color: inherit;

  /deep/ .ant-select-selection {
    background-color: inherit;
    border: 0;
    border-bottom: 1px solid white;
    &__placeholder, &__field__placeholder {
      color: inherit;
    }
  }
}
</style>
