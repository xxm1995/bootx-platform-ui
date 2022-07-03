<template>
  <div>
    <a-page-header
      style="padding-left: 0;padding-top: 0;"
      title="账号绑定 "
    />
    <a-spin :spinning="loading">
      <a-row :span="24">
        <a-col :span="14">
          <a-list>
            <a-list-item>
              <a-list-item-meta title="微信">
                <template #description>
                  <span v-show="bindInfo.weChat.bind">{{ bindInfo.weChat.username }}</span>
                  <span v-show="!bindInfo.weChat.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.weChat.bind" @click="bindSocial(WE_CHAT)" >绑定</a>
                <a v-else @click="unBindSocial(WE_CHAT)" style="color: red">解绑</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="企业微信">
                <template #description>
                  <span v-show="bindInfo.weCom.bind">{{ bindInfo.weCom.username }}</span>
                  <span v-show="!bindInfo.weCom.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.weCom.bind" @click="bindSocial(WE_COM)" >绑定</a>
                <a v-else @click="unBindSocial(WE_COM)" style="color: red">解绑</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="钉钉">
                <template #description>
                  <span v-show="bindInfo.dingTalk.bind">{{ bindInfo.dingTalk.username }}</span>
                  <span v-show="!bindInfo.dingTalk.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.dingTalk.bind" @click="bindSocial(DING_TALK)" >绑定</a>
                <a v-else @click="unBindSocial(DING_TALK)" style="color: red">解绑</a>
              </template>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script>
import { bindSocial, getSocialBindInfo, unbindSocial } from '@/api/system/user'
import { DING_TALK, WE_CHAT, WE_COM } from '@/views/login/third/OpenIdLoginType'

export default {
  data () {
    return {
      DING_TALK,
      WE_CHAT,
      WE_COM,
      loading: false,
      // 绑定信息
      bindInfo: {
        weChat: {},
        weCom: {},
        dingTalk: {},
        qq: {}
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      getSocialBindInfo().then(res => {
        this.bindInfo = res.data
        this.loading = false
      })
    },
    /**
     * 绑定账号
     */
    bindSocial (clientCode) {
      this.currentClientCode = clientCode
      const url = process.env.VUE_APP_API_BASE_URL + `/auth/third/toLoginUrl/${clientCode}`
      window.open(url, `login ${clientCode}`, 'height=600, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')

      // 监听回调
      window.addEventListener('message', this.bindSocialCallback, false)
    },

    bindSocialCallback (event) {
      // 回调后就进行解绑事件, 防止重复接收消息
      window.removeEventListener('message', this.bindSocialCallback)
      const data = event.data
      // 绑定
      this.loading = true
      bindSocial({
        ...data,
        clientCode: this.currentClientCode
      }).then(() => {
        this.$message.success('绑定成功')
        this.init()
      })
    },
    /**
     * 解绑账号
     */
    unBindSocial (clientCode) {
      const that = this
      this.$confirm({
        title: '是否解除绑定的第三方平台账号',
        onOk: async function () {
          await unbindSocial(clientCode)
          that.init()
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
