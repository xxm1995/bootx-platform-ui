<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :autoAdjustOverflow="false"
    :arrowPointAtCenter="false"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template #content>
      <a-spin :spinning="loading">
        <a-list>
          <a-list-item v-for="o in notReadMsgList" :key="o.id">
            <a href="javascript:" @click="showMessage(o)">
              <a-list-item-meta :description="o.senderTime">
                <template #title>
                  <a-tag color="red">未读</a-tag>
                  {{ o.title }}
                </template>
              </a-list-item-meta>
            </a>
            <span>{{ o.senderName }}</span>
          </a-list-item>
        </a-list>
        <div style="margin-top: 5px;text-align: center">
          <a-button @click="toSiteMessage" type="dashed" block>查看更多</a-button>
        </div>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef">
      <a-badge :count="notReadMsgCount">
        <a-icon style="font-size: 16px;" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>

import { countByReceiveNotRead, pageByReceive, read } from '@/api/notice/siteMessage'
import { NOTICE_MESSAGE_UPDATE, NOTICE_SHOW_MESSAGE } from '@/assets/code/VueBusCode'

export default {
  name: 'HeaderNotice',
  data () {
    return {
      // 事件标示
      loading: false,
      visible: false,
      // 未读消息数量
      notReadMsgCount: 0,
      // 消息内容
      notReadMsgList: [
        {
          haveRead: false,
          sendState: null,
          senderName: '',
          senderTime: '',
          title: ''
        }
      ]
    }
  },
  methods: {
    /**
     * 打开列表页
     */
    fetchNotice () {
      if (this.visible) {
        this.visible = false
        this.loading = false
      } else {
        this.visible = true
        this.loading = true
        // 消息列表
        pageByReceive({
          current: 1,
          size: 3,
          haveRead: false
        }).then(res => {
          this.notReadMsgList = res.data.records
          this.loading = false
        })
      }
    },
    /**
     * 未读的消息数量
     */
    receivedCount () {
      // 查询当前用户的未读消息数量
      countByReceiveNotRead().then(res => {
        this.notReadMsgCount = res.data
      })
    },
    /**
     * 跳转到站内信界面
     */
    toSiteMessage () {
      this.$router.push({
        path: '/person/siteMessage'
      })
      this.visible = false
    },
    /**
     * 查看我的消息
     */
    showMessage (message) {
      if (!message.haveRead) {
        read(message.id).then(() => {
          this.receivedCount()
        })
      }
      this.$bus.emit(NOTICE_SHOW_MESSAGE, message)
      this.visible = false
    }
  },
  mounted () {
    this.receivedCount()
    this.$bus.on(NOTICE_MESSAGE_UPDATE, this.receivedCount)
  },
  destroyed () {
    this.$bus.off(NOTICE_MESSAGE_UPDATE)
  }
}
</script>

<style lang="less" scoped>
.header-notice{
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>
