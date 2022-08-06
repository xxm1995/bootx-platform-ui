<template>
  <div class="content" style="width:900px;margin:0 auto;">
    <div id="app-menu" v-cloak>
      <!-- 预览窗 -->
      <div class="weixin-preview">
        <div class="weixin-hd">
          <div class="weixin-title">{{ weixinTitle }}</div>
        </div>
        <div class="weixin-bd">
          <ul class="weixin-menu" id="weixin-menu" >
            <li
              v-for="(mainMenu,mainIndex) in menu.button"
              :key="mainIndex"
              class="menu-item"
              :class="{current:currentMenuIndex===mainIndex}"
              @click="selectedMainMenu(mainIndex,mainMenu)">
              <div class="menu-item-title">
                <i class="icon_menu_dot"></i>
                <span>{{ mainMenu.name }}</span>
              </div>
              <ul class="weixin-sub-menu" v-show="currentMenuIndex===mainIndex">
                <li
                  v-for="(subMenu,subjectIndex) in mainMenu.sub_button"
                  :key="subjectIndex"
                  class="menu-sub-item"
                  :class="{current:currentSubMenuIndex===subjectIndex}"
                  @click.stop="selectedSubMenu(subjectIndex,subMenu)">
                  <div class="menu-item-title">
                    <span>{{ subMenu.name }}</span>
                  </div>
                </li>
                <li v-if="mainMenu.sub_button.length<5" class="menu-sub-item" @click.stop="addSubMenu(mainMenu)">
                  <div class="menu-item-title">
                    <i class="icon14_menu_add"></i>
                  </div>
                </li>
                <!--                <i class="menu-arrow arrow_out"></i>-->
                <!--                <i class="menu-arrow arrow_in"></i>-->
              </ul>
            </li>
            <li class="menu-item" v-if="menu.button.length<3" @click="addMainMenu()">
              <i class="icon14_menu_add"></i>
            </li>
          </ul>
        </div>
      </div>
      <!-- 菜单信息编辑 -->
      <wx-menu-detail-editor
        v-model="currentMenu"
        :menu-detail-type="currentMenuTyp"
        @delete="delMenu"
      ></wx-menu-detail-editor>
    </div>
  </div>
</template>

<script>

import './menu.less'
import WxMenuDetailEditor from '@/components/WechatMenu/WxMenuDetailEditor'
import { MenuTypeMain, MenuTypeMainSubject, MenuTypeSubject } from './MenuType'
const getMaterialAPI = 'https://hopex.github.io/vue-menu/test_material_detail.json'
const getMaterialListAPI = 'https://hopex.github.io/vue-menu/test_material.json'
const getNewsListAPI = 'https://hopex.github.io/vue-menu/test_news.json'

export default {
  name: 'WxMenuEdit',
  components: { WxMenuDetailEditor },
  model: {
    // 自定义为v-model
    prop: 'menu'
  },
  props: {
    // 查询条件
    menu: {
      type: Object,
      default: () => {
        return {
          button: []
        }
      }
    }
  },
  data () {
    return {
      // 菜单类型
      MenuTypeMain,
      MenuTypeMainSubject,
      MenuTypeSubject,
      // 当前选中菜单的类型
      currentMenuTyp: '',
      // 当前选中(焦点所在)的菜单
      currentMenu: {},
      // 当前选中菜单索引
      currentMenuIndex: -1,
      // 当前选中子菜单索引
      currentSubMenuIndex: -1,
      // 标题
      weixinTitle: '',
      // 菜单长度是否过长 (详情用)
      menuNameBounds: false,
      material: {
        title: '',
        url: '',
        thumb_url: ''
      },
      materialLoading: false,
      materialDialog: false,
      materialList: [],
      materialListOffset: 0,
      materialListTotal: 0,
      newsDialog: false,
      newsList: [],
      newsListOffset: 0,
      newsListTotal: 0

    }
  },
  methods: {
    /**
     * 选中主菜单
     * @param i
     * @param menu 微信菜单按钮内容
     */
    selectedMainMenu (i, menu) {
      if (menu.sub_button.length) {
        this.currentMenuTyp = MenuTypeMainSubject
      } else {
        this.currentMenuTyp = MenuTypeMain
      }
      this.currentMenu = menu
      this.currentSubMenuIndex = -1
      this.currentMenuIndex = i
      // 检查名称长度
      // this.checkMenuName(menu.name)
    },
    /**
     * 选中子菜单
     */
    selectedSubMenu (i, menu) {
      this.currentMenuTyp = MenuTypeSubject
      this.currentSubMenuIndex = i
      this.currentMenu = menu
      // this.checkMenuName(menu.name)
    },
    /**
     *  添加主菜单
     */
    addMainMenu () {
      const button = this.menu.button
      // 主菜单添加
      if (button.length < 3) {
        button.push({
          type: 'view',
          name: '菜单名称',
          sub_button: [],
          url: ''
        })
        // 当前选中菜单类型
        this.currentMenuTyp = MenuTypeMain
        this.currentMenuIndex = this.menu.button.length - 1
        this.currentSubMenuIndex = -1
        this.currentMenu = button[button.length - 1]
      }
    },
    /**
     * 添加子菜单
     * @param mainMenu 子菜单所属的主菜单
     */
    addSubMenu (mainMenu) {
      if (mainMenu.sub_button.length < 5) {
        // 判断所属的主菜单是否有内容
        if (true) {

        }
        mainMenu.sub_button.push({
          type: 'view',
          name: '子菜单名称',
          url: ''
        })
        // 当前选中菜单类型变为子菜单
        this.currentMenuTyp = MenuTypeSubject
        // 子菜单索引
        this.currentSubMenuIndex = mainMenu.sub_button.length - 1
        this.currentMenu = mainMenu.sub_button[mainMenu.sub_button.length - 1]
      }
    },
    /**
     * 删除菜单
     */
    async delMenu () {
      // 主菜单
      if ([MenuTypeMain, MenuTypeMainSubject].includes(this.currentMenuTyp)) {
        // 如果有子菜单, 需要二次确认

        this.menu.button.splice(this.currentMenuIndex, 1)
        // 重新定位焦点
        if (this.currentMenuIndex) {
          this.currentMenuIndex -= 1
          this.currentMenu = this.menu.button[this.currentMenuIndex]
        } else {
          this.currentMenu = null
          this.currentMenuTyp = null
        }
      } else {
        const subButton = this.menu.button[this.currentMenuIndex].sub_button
        subButton.splice(this.currentSubMenuIndex, 1)
        // 重新定位焦点
        if (this.currentSubMenuIndex) {
          this.currentSubMenuIndex -= 1
          this.currentMenu = subButton[this.currentSubMenuIndex]
        } else {
          this.currentMenu = this.menu.button[this.currentMenuIndex]
          // 重新定位到主菜单上判断类型
          // eslint-disable-next-line camelcase
          if (this.currentMenu?.sub_button?.length) {
            this.currentMenuTyp = MenuTypeMainSubject
          } else {
            this.currentMenuTyp = MenuTypeMain
          }
        }
      }

      // if (this.selectedMenuLevel() == 1) {
      //   try {
      //     await this.$confirm('删除后菜单下设置的内容将被删除', '提示')
      //   } catch {
      //     return
      //   }
      //   if (this.currentMenuIndex === 0) {
      //     this.menu.button.splice(this.currentMenuIndex, 1)
      //     this.currentMenuIndex = 0
      //   } else {
      //     this.menu.button.splice(this.currentMenuIndex, 1)
      //     this.currentMenuIndex -= 1
      //   }
      //   if (this.menu.button.length == 0) {
      //     this.currentMenuIndex = ''
      //   }
      // } else if (this.selectedMenuLevel() == 2) {
      //   if (this.currentSubMenuIndex === 0) {
      //     this.menu.button[this.currentMenuIndex].sub_button.splice(this.currentSubMenuIndex, 1)
      //     this.currentSubMenuIndex = 0
      //   } else {
      //     this.menu.button[this.currentMenuIndex].sub_button.splice(this.currentSubMenuIndex, 1)
      //     this.currentSubMenuIndex -= 1
      //   }
      //   if (this.menu.button[this.currentMenuIndex].sub_button.length == 0) {
      //     this.currentSubMenuIndex = ''
      //   }
      // }
    },
    /**
     * 选中菜单级别
     */
    selectedMenuLevel () {
      if (this.currentMenuIndex !== '' && this.currentSubMenuIndex === '') {
        // 主菜单
        return 1
      } else if (this.currentMenuIndex !== '' && this.currentSubMenuIndex !== '') {
        // 子菜单
        return 2
      } else {
        // 未选中任何菜单
        return 0
      }
    },
    /**
     * 获取菜单类型 1. view网页类型，2. media_id类型和view_limited类型 3. click点击类型，4.miniprogram表示小程序类型
     */
    selectedMenuType () {
      if (this.selectedMenuLevel() == 1 && this.menu.button[this.currentMenuIndex].sub_button.length == 0) {
        // 主菜单
        switch (this.menu.button[this.currentMenuIndex].type) {
          case 'view':
            return 1
          case 'media_id':
            return 2
          case 'view_limited':
            return 2
          case 'click':
            return 3
          case 'scancode_push':
            return 3
          case 'scancode_waitmsg':
            return 3
          case 'pic_sysphoto':
            return 3
          case 'pic_photo_or_album':
            return 3
          case 'pic_weixin':
            return 3
          case 'location_select':
            return 3
          case 'miniprogram':
            return 4
        }
      } else if (this.selectedMenuLevel() == 2) {
        // 子菜单
        switch (this.menu.button[this.currentMenuIndex].sub_button[this.currentSubMenuIndex].type) {
          case 'view':
            return 1
          case 'media_id':
            return 2
          case 'view_limited':
            return 2
          case 'click':
            return 3
          case 'scancode_push':
            return 3
          case 'scancode_waitmsg':
            return 3
          case 'pic_sysphoto':
            return 3
          case 'pic_photo_or_album':
            return 3
          case 'pic_weixin':
            return 3
          case 'location_select':
            return 3
          case 'miniprogram':
            return 4
        }
      } else {
        return 1
      }
    },
    // 检查菜单名称长度
    checkMenuName (val) {
      // 主菜单
      if ([MenuTypeMain, MenuTypeMainSubject].includes(this.currentMenuTyp) && this.getMenuNameLen(val) <= 8) {
        this.menuNameBounds = false
        return
      }
      // 子菜单
      if (this.currentMenuTyp === MenuTypeSubject && this.getMenuNameLen(val) <= 16) {
        this.menuNameBounds = false
      }
      this.menuNameBounds = true
    },
    /**
     * 获取菜单名称长度
     */
    getMenuNameLen (val) {
      let len = 0
      for (let i = 0; i < val.length; i++) {
        const a = val.charAt(i)
        // eslint-disable-next-line no-control-regex
        a.match(/[^\x00-\xff]/gi) != null ? (len += 2) : (len += 1)
      }
      return len
    },
    /**
     * 选择公众号素材库素材
     */
    selectMaterialId () {
      this.materialDialog = true
      this.getMaterialList()
    },
    /**
     * 选择公众号图文链接
     */
    selectNewsUrl () {
      this.newsDialog = true
      this.getNewsList()
    },
    /**
     * 设置选择的素材id
     */
    setMaterialId (row) {
      const { media_id, content } = row
      if (this.selectedMenuLevel() == 1) {
        this.$set(this.menu.button[this.currentMenuIndex], 'media_id', media_id)
      } else if (this.selectedMenuLevel() == 2) {
        this.$set(this.menu.button[this.currentMenuIndex].sub_button[this.currentSubMenuIndex], 'media_id', media_id)
      }
      const { news_item } = content
      const item = news_item[0]
      this.material.title = item.title
      this.material.url = item.url
      this.materialDialog = false
    },
    /**
     *  删除选择的素材id
     */
    delMaterialId () {
      if (this.selectedMenuLevel() == 1) {
        this.$set(this.menu.button[this.currentMenuIndex], 'media_id', '')
      } else if (this.selectedMenuLevel() == 2) {
        this.$set(this.menu.button[this.currentMenuIndex].sub_button[this.currentSubMenuIndex], 'media_id', '')
      }
    },
    /**
     * 设置选择的图文链接
     */
    setNewsUrl (row) {
      const { url } = row
      if (this.selectedMenuLevel() == 1) {
        this.$set(this.menu.button[this.currentMenuIndex], 'url', url)
      } else if (this.selectedMenuLevel() == 2) {
        this.$set(this.menu.button[this.currentMenuIndex].sub_button[this.currentSubMenuIndex], 'url', url)
      }
      this.newsDialog = false
    },
    /**
     * 获取素材信息
     */
    async getMaterial (id) {
      this.materialLoading = true
      try {
        const url = `${getMaterialAPI}?${new URLSearchParams({
          media_id: id
        })}`
        const resp = await fetch(url)
        const res = await resp.json()
        this.material.title = res.data.news_item[0].title
        this.material.url = res.data.news_item[0].url
      } catch (err) {
        console.error(err)
      }
      this.materialLoading = false
    },
    async getNewsList () {
      if (this.newsListOffset > 0 && this.newsListOffset >= this.newsListOffset) {
        return
      }
      try {
        const url = `${getNewsListAPI}?${new URLSearchParams({
          type: 'news',
          offset: this.newsListOffset,
          count: 20
        })}`
        const resp = await fetch(url)
        const res = await resp.json()
        this.newsList = this.newsList.concat(res.data.item)
        this.newsListOffset += res.data.item_count
        this.newsListTotal = res.data.total_count
      } catch (err) {
        console.error(err)
      }
    },
    async getMaterialList () {
      if (this.materialListOffset > 0 && this.materialListOffset >= this.materialListTotal) {
        return
      }
      try {
        const url = `${getMaterialListAPI}?${new URLSearchParams({
          type: 'news',
          offset: this.materialListOffset,
          count: 20
        })}`
        const resp = await fetch(url)
        const res = await resp.json()
        this.materialList = this.materialList.concat(res.data.item)
        this.materialListOffset += res.data.item_count
        this.materialListTotal = res.data.total_count
      } catch (err) {
        console.error(err)
      }
    },
    /**
     * 发布
     * @returns {Promise<void>}
     */
    async onMenuSubmit () {
      try {
        console.log(this.menu)
        await this.$confirm('确定后发布当前自定义菜单', '提示')
        // TODO submitAPI
        this.$message.success('发布成功')
        console.log(
          JSON.stringify(this.menu)
        )
      } catch (err) {
        console.error(err)
      }
    },
    /**
     * 清空
     */
    async onMenuClear () {
      try {
        await this.$confirm('确定后将清空后公众号自定义菜单', '提示')
        // TODO clearAPI
        this.$message.success('清空成功')
        this.menu.button = []
      } catch (err) {
        console.error(err)
      }
    }
  },
  mounted () {
    console.log(this.menu)
  }
}
</script>

<style lang="less" scoped>

</style>
