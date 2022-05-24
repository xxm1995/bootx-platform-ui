
export const WebsocketMixin = {
  data () {
    return {
      websocketUrl: '',
      websocket: {}
    }
  },
  destroyed () {
    // 离开页面生命周期函数
    this.websocketOnclose()
  },
  methods: {
    initWebSocket () {
      this.websocket = new WebSocket(this.websocketUrl)
      this.websocket.onopen = this.websocketOnopen
      this.websocket.onerror = this.websocketOnerror
      this.websocket.onmessage = this.websocketOnmessage
      this.websocket.onclose = this.websocketOnclose
    },
    // 连接成功
    websocketOnopen: function () {
      console.log('WebSocket连接成功')
    },
    // 连接出错
    websocketOnerror: function (e) {
      console.log('WebSocket连接发生错误')
      this.reconnect()
    },
    // 连接被关闭
    websocketOnclose: function (e) {
      console.log('ws连接被关闭')
      this.reconnect()
    },
    // 发送消息
    websocketSend (text) {
      // 数据发送
      try {
        this.websocket.send(text)
      } catch (err) {
        console.log('send failed (' + err.code + ')')
      }
    },
    // 接受消息
    websocketOnmessage (e) {
      console.log('-----接收消息-------', e.data)
    },
    // 重连
    reconnect () {
      console.info('尝试重连')
      const that = this
      if (that.lockReconnect) return
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
        console.info('尝试重连...')
        that.initWebSocket()
        that.lockReconnect = false
      }, 5000)
    }
  }

}
