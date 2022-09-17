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
              <a-list-item-meta title="微信(公众号)">
                <template #description>
                  <span v-show="bindInfo.weChat.bind">{{ bindInfo.weChat.username }}</span>
                  <span v-show="!bindInfo.weChat.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.weChat.bind" @click="bindWeChat" >绑定</a>
                <a v-else @click="unBindThird(WE_CHAT)" style="color: red">解绑</a>
              </template>
            </a-list-item>
            <a-list-item>
              <a-list-item-meta title="微信(开放平台)">
                <template #description>
                  <span v-show="bindInfo.weChatOpen.bind">{{ bindInfo.weChatOpen.username }}</span>
                  <span v-show="!bindInfo.weChatOpen.bind">未绑定</span>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a v-if="!bindInfo.weChatOpen.bind" @click="bindThird(WE_CHAT_OPEN)" >绑定</a>
                <a v-else @click="unBindThird(WE_CHAT_OPEN)" style="color: red">解绑</a>
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
                <a v-if="!bindInfo.weCom.bind" @click="bindThird(WE_COM)" >绑定</a>
                <a v-else @click="unBindThird(WE_COM)" style="color: red">解绑</a>
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
                <a v-if="!bindInfo.dingTalk.bind" @click="bindThird(DING_TALK)" >绑定</a>
                <a v-else @click="unBindThird(DING_TALK)" style="color: red">解绑</a>
              </template>
            </a-list-item>
          </a-list>
        </a-col>
      </a-row>
    </a-spin>
    <we-chat-qr-bind ref="weChatQrBind" @bind="bindWeChatCallback"/>
  </div>
</template>

<script>
import { bindThird, getThirdBindInfo, unbindThird } from '@/api/system/user'
import { DING_TALK, WE_CHAT, WE_CHAT_OPEN, WE_COM } from '@/views/login/third/OpenIdLoginType'
import WeChatQrBind from '@/views/account/bind/WeChatQrBind'

export default {
  components: { WeChatQrBind },
  data () {
    return {
      DING_TALK,
      WE_CHAT,
      WE_CHAT_OPEN,
      WE_COM,
      loading: false,
      // 绑定信息
      bindInfo: {
        weChat: {},
        weChatOpen: {},
        weCom: {},
        dingTalk: {},
        qq: {}
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      getThirdBindInfo().then(res => {
        this.bindInfo = res.data
        this.loading = false
      })
    },
    /**
     * 绑定账号
     */
    bindThird (clientCode) {
      this.currentClientCode = clientCode
      const url = process.env.VUE_APP_API_BASE_URL + `/auth/third/toLoginUrl/${clientCode}`
      window.open(url, `login ${clientCode}`, 'height=600, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')

      // 监听回调
      window.addEventListener('message', this.bindThirdCallback, false)
    },
    /**
     * 扫码回调
     */
    async bindThirdCallback (event) {
      // 回调后就进行解绑事件, 防止重复接收消息
      window.removeEventListener('message', this.bindThirdCallback)
      const data = event.data
      // 绑定
      this.loading = true
      bindThird({
        ...data,
        clientCode: this.currentClientCode
      }).then(() => {
        this.$message.success('绑定成功')
      }).finally(() => {
        this.init()
      })
    },
    /**
     * 微信公众平台绑定
     */
    bindWeChat () {
      this.$refs.weChatQrBind.init()
    },
    /**
     * 微信绑定回调
     */
    bindWeChatCallback (from) {
      this.loading = true
      bindThird(from).then(() => {
        this.$message.success('绑定成功')
      }).finally(() => {
        this.init()
      })
    },
    /**
     * 解绑账号
     */
    unBindThird (clientCode) {
      const that = this
      this.$confirm({
        title: '是否解除绑定的第三方平台账号',
        okText: '确定',
        cancelText: '取消',
        onOk: async function () {
          await unbindThird(clientCode)
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
