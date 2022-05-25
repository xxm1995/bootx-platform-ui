<template>
  <a-card>
    <a-textarea disabled v-model="showMsg"></a-textarea>
    <a-textarea v-model="msg"></a-textarea>
    <a-button @click="push">发送</a-button>
  </a-card>
</template>

<script>

import { WebsocketMixin } from '@/mixins/WebsocketMixin'
import storage from 'store'
import { USERINFO } from '@/store/mutation-types'

export default {
  name: 'WebsocketDemo',
  mixins: [WebsocketMixin],
  data () {
    return {
      msg: '',
      showMsg: ''
    }
  },
  methods: {
    initWs () {
      // 建立连接对象
      const userId = storage.get(USERINFO).userId
      this.getParam('WebsocketServerUrl').then(({ data: url }) => {
        this.websocketUrl = url + '/test/ws/' + userId
        this.initWebSocket()
      })
    },
    // 发送消息
    push () {
      this.websocketSend(this.msg)
    },

    websocketOnmessage (e) {
      this.showMsg = e.data
      console.log(e.data)
    }
  },
  mounted () {
    this.initWs()
  },
  beforeDestroy () {
  }
}
</script>

<style scoped>

</style>
