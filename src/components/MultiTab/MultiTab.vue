<script>
import events from './events'
import { CACHE_MULTI_TAB_COMPONENTS } from '@/store/mutation-types'
import storage from 'store'
import DefaultSettings from '@/config/defaultSettings'
export default {
  name: 'MultiTab',
  data () {
    return {
      fullPathList: [],
      pages: [],
      activeKey: '',
      newTabIndex: 0
    }
  },
  created () {
    // bind event
    events.$on('open', val => {
      if (!val) {
        throw new Error(`multi-tab: open tab ${val} err`)
      }
      this.activeKey = val
    }).$on('close', val => {
      if (!val) {
        this.closeThat(this.activeKey)
        return
      }
      this.closeThat(val)
    }).$on('rename', ({ key, name }) => {
      console.log('rename', key, name)
      try {
        const item = this.pages.find(item => item.path === key)
        item.meta.customTitle = name
        this.$forceUpdate()
      } catch (e) {
      }
    })

    this.pages.push(this.$route)
    this.fullPathList.push(this.$route.fullPath)
    this.selectedLastPath()
  },
  methods: {
    // 不能删除
    onEdit (targetKey, action) {
      this[action](targetKey)
    },
    // 删除
    remove (key) {
      const removeRoute = this.pages.filter(item => item.fullPath === key)
      this.pages = this.pages.filter(page => page.fullPath !== key)
      this.fullPathList = this.fullPathList.filter(path => path !== key)
      // 判断当前标签是否关闭，若关闭则跳转到最后一个还存在的标签页
      if (!this.fullPathList.includes(this.activeKey)) {
        this.selectedLastPath()
      }

      // 关闭页面则从缓存中删除路由，下次点击菜单会重新加载页面
      const cacheComponents = storage.get(CACHE_MULTI_TAB_COMPONENTS) || []
      if (removeRoute && removeRoute[0]) {
        const componentName = removeRoute[0].meta.componentName
        if (cacheComponents.includes(componentName)) {
          cacheComponents.splice(cacheComponents.findIndex(item => item === componentName), 1)
          storage.set(CACHE_MULTI_TAB_COMPONENTS, cacheComponents)
        }
      }
    },
    selectedLastPath () {
      this.activeKey = this.fullPathList[this.fullPathList.length - 1]
    },

    // content menu
    closeThat (e) {
      // 判断是否为最后一个标签页，如果是最后一个，则无法被关闭
      if (this.fullPathList.length > 1) {
        this.remove(e)
      } else {
        this.$message.info('这是最后一个标签了, 无法被关闭')
      }
    },
    // 关闭左侧
    closeLeft (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex > 0) {
        this.fullPathList.forEach((item, index) => {
          if (index < currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('左侧没有标签')
      }
    },
    // 关闭右侧
    closeRight (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      if (currentIndex < (this.fullPathList.length - 1)) {
        this.fullPathList.forEach((item, index) => {
          if (index > currentIndex) {
            this.remove(item)
          }
        })
      } else {
        this.$message.info('右侧没有标签')
      }
    },
    // 关闭全部
    closeAll (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      this.fullPathList.forEach((item, index) => {
        if (index !== currentIndex) {
          this.remove(item)
        }
      })
    },
    // 刷新页面 (未完成)
    routeReload (e) {
      const currentIndex = this.fullPathList.indexOf(e)
      const route = this.pages[currentIndex]
      console.log(route)

      // 关闭页面则从缓存中删除路由，下次点击菜单会重新加载页面
      const cacheComponents = storage.get(CACHE_MULTI_TAB_COMPONENTS) || []
      const componentName = route.meta.componentName
      if (cacheComponents.includes(componentName)) {
        cacheComponents.splice(cacheComponents.findIndex(item => item === componentName), 1)
        storage.set(CACHE_MULTI_TAB_COMPONENTS, cacheComponents)
      }
      this.pages.splice(currentIndex, 1)
      // this.$router.push('/system/log/DataVersionLog')

      this.pages.splice(currentIndex, 0, route)
    },
    // 右键菜单点击
    menuClick (key, route) {
      this[key](route)
    },
    renderTabPaneMenu (e) {
      // <a-menu-item key="routeReload">刷新</a-menu-item>
      return (
        <a-menu {...{ on: { click: ({ key, item, domEvent }) => { this.menuClick(key, e) } } }}>
          <a-menu-item key="closeThat">关闭当前</a-menu-item>
          <a-menu-item key="closeRight">关闭右侧</a-menu-item>
          <a-menu-item key="closeLeft">关闭左侧</a-menu-item>
          <a-menu-item key="closeAll">关闭其他</a-menu-item>
        </a-menu>
      )
    },
    // render
    renderTabPane (title, keyPath) {
      const menu = this.renderTabPaneMenu(keyPath)

      return (
        <a-dropdown overlay={menu} trigger={['contextmenu']}>
          <span style={{ userSelect: 'none' }}>{ title }</span>
        </a-dropdown>
      )
    }
  },
  watch: {
    '$route': function (newVal) {
      this.activeKey = newVal.fullPath
      if (this.fullPathList.indexOf(newVal.fullPath) < 0) {
        this.fullPathList.push(newVal.fullPath)
        this.pages.push(newVal)
      }
    },
    activeKey: function (newPathKey) {
      this.$router.push({ path: newPathKey })
    }
  },
  render () {
    const { onEdit, $data: { pages } } = this
    const panes = pages.map(page => {
      return (
        <a-tab-pane
          style={{ height: 0 }}
          tab={this.renderTabPane(page.meta.customTitle || page.meta.title, page.fullPath)}
          key={page.fullPath} closable={pages.length > 1}
        >
        </a-tab-pane>)
    })

    return (
      /* 是否随着顶栏活动 */
      <div class={DefaultSettings.fixedHeader ? 'ant-pro-multi-tab' : null}>
        <div class="ant-pro-multi-tab-wrapper">
          <a-tabs
            hideAdd
            type={'editable-card'}
            v-model={this.activeKey}
            tabBarStyle={{ background: '#FFF', margin: 0, paddingLeft: '16px', paddingTop: '1px' }}
            {...{ on: { edit: onEdit } }}>
            {panes}
          </a-tabs>
        </div>
      </div>
    )
  }
}
</script>
<style lang="less" scoped>
</style>
