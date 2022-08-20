<template>
  <a-card>
    <a-textarea disabled v-model="showMsg"></a-textarea>
    <a-textarea v-model="msg"></a-textarea>
    <a-space>
      <a-button @click="push">发送(本页面)</a-button>
      <a-button @click="globalPush">发送(全局)</a-button>
    </a-space>
  </a-card>
</template>

<script>

import { WebsocketMixin } from '@/mixins/WebsocketMixin'
import storage from 'store'
import { USERINFO, WEBSOCKET_SERVER_URL } from '@/store/mutation-types'
import { axios } from '@/utils/request'
import { EVENT_TEST_WEBSOCKET } from '@/assets/code/VueBusCode'

export default {
  name: 'WebsocketDemo',
  mixins: [WebsocketMixin],
  data () {
    return {
      userId: 0,
      msg: '',
      showMsg: ''
    }
  },
  methods: {
    initWs () {
      // 建立连接对象
      this.userId = storage.get(USERINFO).userId
      this.getParam(WEBSOCKET_SERVER_URL).then(({ data: url }) => {
        this.websocketUrl = url + '/test/ws/' + this.userId
        this.initWebSocket()
      })
    },
    // 发送消息 (本页面)
    push () {
      this.websocketSend(this.msg)
    },
    // 发送 (全局ws)
    globalPush () {
      axios({
        url: '/demo/global/ws/send',
        method: 'post',
        params: { userId: this.userId, msg: this.msg }
      })
    },
    // 接收消息 (本页面ws)
    websocketOnmessage (e) {
      this.showMsg = '本页面WS消息: ' + e.data
    },
    // 全局ws事件监听
    globalWsListener (data) {
      this.showMsg = '全局WS消息: ' + data
      this.$message.info(`接到了全局WS消息: ${data}`)
    }
  },
  mounted () {
    this.initWs()
    this.$bus.on(EVENT_TEST_WEBSOCKET, this.globalWsListener)
  },
  destroyed () {
    // 解绑事件监听
    this.$bus.off(EVENT_TEST_WEBSOCKET)
    this.websocketOnclose()
  }
}
</script>

<style scoped>

</style>
