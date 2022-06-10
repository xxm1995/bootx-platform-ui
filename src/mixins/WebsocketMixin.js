import { findByParamKey } from '@/api/system/param'

export const WebsocketMixin = {
  data () {
    return {
      websocketUrl: '',
      websocket: {},
      lockReconnect: false
    }
  },
  destroyed () {
    // 离开页面生命周期函数
    this.closWebsocket()
  },
  methods: {
    // 获取系统参数值
    getParam (key) {
      return findByParamKey(key)
    },
    // 初始化websocket
    initWebSocket () {
      this.websocket = new WebSocket(this.websocketUrl)
      this.websocket.onopen = this.websocketOnopen
      this.websocket.onerror = this.websocketOnerror
      this.websocket.onmessage = this.websocketOnmessage
      this.websocket.onclose = this.websocketOnclose
      this.lockReconnect = false
    },
    /**
     * 连接成功时间
     */
    websocketOnopen: function () {
      console.log('WebSocket连接成功')
    },
    /**
     * 连接出错事件
     */
    websocketOnerror: function (e) {
      console.log('WebSocket连接发生错误')
      this.reconnect()
    },
    /**
     * 连接被关闭事件
     */
    websocketOnclose: function (e) {
      console.log('ws连接被关闭')
      this.reconnect()
    },
    /**
     * 发送消息
     */
    websocketSend (text) {
      // 数据发送
      try {
        this.websocket.send(text)
      } catch (err) {
        console.log('send failed (' + err.code + ')')
      }
    },
    /**
     * 接收消息
     */
    websocketOnmessage (e) {
      console.log('-----接收消息-------', e.data)
    },
    /**
     * 重连
     */
    reconnect () {
      if (this.closeFlag) {
        return
      }
      const that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
        console.info('尝试重连...')
        that.initWebSocket()
      }, 5000)
    },
    /**
     * 关闭websocket连接
     */
    closWebsocket () {
      this.websocket.close()
      this.lockReconnect = true
    }
  }

}
