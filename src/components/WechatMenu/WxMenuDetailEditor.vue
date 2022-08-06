<template>
  <div>
    <!-- 主菜单 -->
    <div class="weixin-menu-detail" v-if="[MenuTypeMainSubject,MenuTypeMain].includes(menuDetailType)">
      <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
        <div class="menu-name">{{ menuDetail.name }}</div>
        <div class="menu-del" @click="delMenu">删除菜单</div>
      </div>
      <!--    主菜单内容  -->
      <div class="menu-input-group">

        <a-form-model>
          <a-form-model-item label="菜单名称" prop="name">
            <a-input
              type="text"
              name="name"
              placeholder="请输入菜单名称"
              class="menu-input-text"
              v-model="menuDetail.name"
            />
          </a-form-model-item>

        </a-form-model>
      </div>
      <!--    主菜单内容(不包含子菜单)  -->
      <!--      <template v-if="['main'].includes(menuDetailType)">-->
      <!--        <div class="menu-input-group">-->
      <!--          <div class="menu-label">菜单内容</div>-->
      <!--          <div class="menu-input">-->
      <!--            <select v-model="menu.button[selectedMenuIndex].type" name="type" class="menu-input-text">-->
      <!--              <option value="view">跳转网页(view)</option>-->
      <!--              <option value="media_id">发送消息(media_id)</option>-->
      <!--              &lt;!&ndash;<option value="view_limited">跳转公众号图文消息链接(view_limited)</option>&ndash;&gt;-->
      <!--              <option value="miniprogram">打开指定小程序(miniprogram)</option>-->
      <!--              <option value="click">自定义点击事件(click)</option>-->
      <!--              <option value="scancode_push">扫码上传消息(scancode_push)</option>-->
      <!--              <option value="scancode_waitmsg">扫码提示下发(scancode_waitmsg)</option>-->
      <!--              <option value="pic_sysphoto">系统相机拍照(pic_sysphoto)</option>-->
      <!--              <option value="pic_photo_or_album">弹出拍照或者相册(pic_photo_or_album)</option>-->
      <!--              <option value="pic_weixin">弹出微信相册(pic_weixin)</option>-->
      <!--              <option value="location_select">弹出地理位置选择器(location_select)</option>-->
      <!--            </select>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="menu-content" v-if="selectedMenuType()==1">-->
      <!--          <div class="menu-input-group">-->
      <!--            <p class="menu-tips">订阅者点击该子菜单会跳到以下链接</p>-->
      <!--            <div class="menu-label">页面地址</div>-->
      <!--            <div class="menu-input">-->
      <!--              <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].url">-->
      <!--              <p class="menu-tips cursor" @click="selectNewsUrl">从公众号图文消息中选择</p>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="menu-msg-content" v-else-if="selectedMenuType()==2" v-loading="materialLoading">-->
      <!--          <div class="menu-msg-head"><i class="icon_msg_sender"></i>图文消息</div>-->
      <!--          <div class="menu-msg-panel">-->
      <!--            <div class="menu-msg-select" v-if="!menu.button[selectedMenuIndex].media_id" @click="selectMaterialId">-->
      <!--              <i class="icon36_common add_gray"></i>-->
      <!--              <strong>从素材库中选择</strong>-->
      <!--            </div>-->
      <!--            <div class="menu-msg-select" v-else>-->
      <!--              <div class="menu-msg-title"><i class="icon_msg_sender"></i>{{ material.title }}</div>-->
      <!--              <a :href="material.url" target="_blank" class="el-button el-button&#45;&#45;mini">查看</a>-->
      <!--              <el-button size="mini" type="danger" @click="delMaterialId">删除</el-button>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="menu-content" v-else-if="selectedMenuType()==3">-->
      <!--          <div class="menu-input-group">-->
      <!--            <p class="menu-tips">用于消息接口推送，不超过128字节</p>-->
      <!--            <div class="menu-label">菜单KEY值</div>-->
      <!--            <div class="menu-input">-->
      <!--              <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].key">-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="menu-content" v-else-if="selectedMenuType()==4">-->
      <!--          <div class="menu-input-group">-->
      <!--            <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>-->
      <!--            <div class="menu-label">小程序APPID</div>-->
      <!--            <div class="menu-input">-->
      <!--              <input type="text" placeholder="小程序的appid（仅认证公众号可配置）" class="menu-input-text" v-model="menu.button[selectedMenuIndex].appid">-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="menu-input-group">-->
      <!--            <div class="menu-label">小程序路径</div>-->
      <!--            <div class="menu-input">-->
      <!--              <input type="text" placeholder="小程序的页面路径 pages/Index/index" class="menu-input-text" v-model="menu.button[selectedMenuIndex].pagepath">-->
      <!--            </div>-->
      <!--          </div>-->
      <!--          <div class="menu-input-group">-->
      <!--            <div class="menu-label">备用网页</div>-->
      <!--            <div class="menu-input">-->
      <!--              <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].url">-->
      <!--              <p class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>-->
      <!--            </div>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--      </template>-->
    </div>
    <!-- 子菜单 -->
    <div class="weixin-menu-detail" v-if="menuDetailType === MenuTypeSubject">
      <div class="menu-input-group" style="border-bottom: 2px #e8e8e8 solid;">
        <div class="menu-name">{{ menuDetail.name }}</div>
        <div class="menu-del" @click="delMenu">删除子菜单</div>
      </div>
      <div class="menu-input-group">
        <a-form-model>
          <a-form-model-item label="子菜单名称" prop="name">
            <a-input
              type="text"
              name="name"
              placeholder="请输入菜单名称"
              class="menu-input-text"
              v-model="menuDetail.name"
            />
          </a-form-model-item>

        </a-form-model>
      </div>
    <!--      <div class="menu-input-group">-->
    <!--        <div class="menu-label">子菜单内容</div>-->
    <!--        <div class="menu-input">-->
    <!--          <select v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].type" name="type" class="menu-input-text">-->
    <!--            <option value="view">跳转网页(view)</option>-->
    <!--            <option value="media_id">发送消息(media_id)</option>-->
    <!--            &lt;!&ndash;<option value="view_limited">跳转公众号图文消息链接(view_limited)</option>&ndash;&gt;-->
    <!--            <option value="miniprogram">打开指定小程序(miniprogram)</option>-->
    <!--            <option value="click">自定义点击事件(click)</option>-->
    <!--            <option value="scancode_push">扫码上传消息(scancode_push)</option>-->
    <!--            <option value="scancode_waitmsg">扫码提示下发(scancode_waitmsg)</option>-->
    <!--            <option value="pic_sysphoto">系统相机拍照(pic_sysphoto)</option>-->
    <!--            <option value="pic_photo_or_album">弹出拍照或者相册(pic_photo_or_album)</option>-->
    <!--            <option value="pic_weixin">弹出微信相册(pic_weixin)</option>-->
    <!--            <option value="location_select">弹出地理位置选择器(location_select)</option>-->
    <!--          </select>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="menu-content" v-if="selectedMenuType()==1">-->
    <!--        <div class="menu-input-group">-->
    <!--          <p class="menu-tips">订阅者点击该子菜单会跳到以下链接</p>-->
    <!--          <div class="menu-label">页面地址</div>-->
    <!--          <div class="menu-input">-->
    <!--            <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].url">-->
    <!--            <p class="menu-tips cursor" @click="selectNewsUrl">从公众号图文消息中选择</p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="menu-msg-content" v-else-if="selectedMenuType()==2" v-loading="materialLoading">-->
    <!--        <div class="menu-msg-head"><i class="icon_msg_sender"></i>图文消息</div>-->
    <!--        <div class="menu-msg-panel">-->
    <!--          <div class="menu-msg-select" v-if="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].media_id==''||menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].media_id==undefined" @click="selectMaterialId">-->
    <!--            <i class="icon36_common add_gray"></i>-->
    <!--            <strong>从素材库中选择</strong>-->
    <!--          </div>-->
    <!--          <div class="menu-msg-select" v-else>-->
    <!--            <i class="icon_msg_sender"></i>{{ material.title }}-->
    <!--            <a :href="material.url" target="_blank" class="el-button el-button&#45;&#45;mini">查看</a>-->
    <!--            <el-button size="mini" type="danger" @click="delMaterialId">删除</el-button>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="menu-content" v-else-if="selectedMenuType()==3">-->
    <!--        <div class="menu-input-group">-->
    <!--          <p class="menu-tips">用于消息接口推送，不超过128字节</p>-->
    <!--          <div class="menu-label">菜单KEY值</div>-->
    <!--          <div class="menu-input">-->
    <!--            <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].key">-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div class="menu-content" v-else-if="selectedMenuType()==4">-->
    <!--        <div class="menu-input-group">-->
    <!--          <p class="menu-tips">订阅者点击该子菜单会跳到以下小程序</p>-->
    <!--          <div class="menu-label">小程序APPID</div>-->
    <!--          <div class="menu-input">-->
    <!--            <input type="text" placeholder="小程序的appid（仅认证公众号可配置）" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].appid">-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="menu-input-group">-->
    <!--          <div class="menu-label">小程序路径</div>-->
    <!--          <div class="menu-input">-->
    <!--            <input type="text" placeholder="小程序的页面路径 pages/Index/index" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].pagepath">-->
    <!--          </div>-->
    <!--        </div>-->
    <!--        <div class="menu-input-group">-->
    <!--          <div class="menu-label">备用网页</div>-->
    <!--          <div class="menu-input">-->
    <!--            <input type="text" placeholder="" class="menu-input-text" v-model="menu.button[selectedMenuIndex].sub_button[selectedSubMenuIndex].url">-->
    <!--            <p class="menu-tips">旧版微信客户端无法支持小程序，用户点击菜单时将会打开备用网页。</p>-->
    <!--          </div>-->
    <!--        </div>-->
    <!--      </div>-->
    </div>
  </div>

</template>

<script>
import { MenuTypeMain, MenuTypeMainSubject, MenuTypeSubject } from './MenuType'

export default {
  name: 'WxMenuDetailEditor',
  model: {
    prop: 'menuDetail'
  },
  props: {
    /**
     * '' 不显示, main 主菜单, mainSubject 主菜单下包含子菜单, subject 子菜单
     */
    menuDetailType: {
      type: String,
      default: ''
    },
    menuDetail: {
      type: Object,
      default: () => {
        return {
          name: ''
        }
      }
    }
  },
  data () {
    return {
      MenuTypeMain,
      MenuTypeMainSubject,
      MenuTypeSubject
    }
  },
  methods: {
    /**
     * 删除
     */
    delMenu () {
      this.$emit('delete')
    }
  }
}
</script>

<style scoped>

</style>
