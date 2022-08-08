import { findByParamKey } from '@/api/system/param'
import storage from 'store'
import { ACCESS_TOKEN, WEBSOCKET_SERVER_URL } from '@/store/mutation-types'
import { notification } from 'ant-design-vue'
import { EVENT_NOTICE, NOTIFICATION_ERROR, NOTIFICATION_INFO, NOTIFICATION_WARN } from '@/websocket/WebSockerType'
import Vue from '@/main'
// wsUrl
let wsUrl
// websocket 连接对象
let websocket = {}
// 重连标识
let lockReconnect
// 手动关闭标识
let close = true

/**
 * 连接成功
 */
function websocketOnopen () {
  console.log('用户全局WebSocket连接成功')
}
/**
 * 连接出错
 */
function websocketOnerror (e) {
  console.log('用户全局WebSocket连接发生错误')
  reconnect()
}

/**
 * 连接被关闭
 */
function websocketOnclose (e) {
  console.log('用户全局WebSocket连接被关闭')
  if (close) {
    reconnect()
  }
}

/**
 * 重连
 */
function reconnect () {
  console.info('尝试重连')
  if (lockReconnect) {
    return
  }
  lockReconnect = true
  // 没连接上会一直重连，设置延迟避免请求过多
  setTimeout(function () {
    console.info('尝试重连...')
    initWebSocket().then().catch()
    lockReconnect = false
  }, 5000)
}

/**
 * 处理接收到的消息
 */
function websocketOnmessage (e) {
  const res = JSON.parse(e.data)

  if ([NOTIFICATION_INFO, NOTIFICATION_INFO, NOTIFICATION_ERROR].includes(res.type)) {
    wsNotification(res)
  } else if ([EVENT_NOTICE].includes(res.type)) {
    wsEventNotice(res)
  }
}

/**
 * 初始化websocket
 */
export async function initWebSocket () {
  // 获取token
  const token = storage.get(ACCESS_TOKEN)
  // 判断一下token是否有效
  if (!wsUrl) {
    const { data: url } = await findByParamKey(WEBSOCKET_SERVER_URL)
    wsUrl = url
  }
  const websocketUrl = wsUrl + '/ws/user?AccessToken=' + token
  websocket = new WebSocket(websocketUrl)
  close = false
  websocket.onopen = websocketOnopen
  websocket.onerror = websocketOnerror
  websocket.onmessage = websocketOnmessage
  websocket.onclose = websocketOnclose
}

/**
 * 关闭ws连接
 */
export function closeWebSocket () {
  console.log('关闭ws连接')
  close = false
  websocket.close()
}

/**
 * 事件通知 弹框
 */
function wsNotification (res) {
  if (res.type === NOTIFICATION_INFO) {
    notification.info({
      message: '消息通知',
      description: res.data
    })
  } else if (res.type === NOTIFICATION_WARN) {
    notification.warn({
      message: '警告',
      description: res.data
    })
  } else if (res.type === NOTIFICATION_ERROR) {
    notification.info({
      message: '警告',
      description: res.data
    })
  }
}

/**
 * 事件通知 发送到消息总线
 */
function wsEventNotice (res) {
  // 发布事件到消息总线
  Vue.$bus.emit(res.eventCode, res.data)
}

// 监听页面关闭事件, 关闭ws连接
window.onbeforeunload = function () {
  websocket.close()
}
