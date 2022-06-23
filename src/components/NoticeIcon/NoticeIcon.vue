<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template v-slot:content>
      <a-spin :spinning="loading">
        <a-tabs >
          <a-tab-pane tab="通知消息" key="1">
            <a-list>
              <a-list-item>
                <a-list-item-meta title="你收到了 14 份新周报" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="你推荐的 曲妮妮 已通过第三轮面试" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            <div style="margin-top: 5px;text-align: center">
              <a-button @click="toSiteMessage" type="dashed" block>查看更多</a-button>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="待办消息" key="2">
            <a-list>
              <a-list-item>
                <a-list-item-meta title="你收到了 14 份新周报" description="">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="你推荐的 曲妮妮 已通过第三轮面试" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png"/>
                </a-list-item-meta>
              </a-list-item>
              <a-list-item>
                <a-list-item-meta title="这种模板可以区分多种通知类型" description="一年前">
                  <a-avatar style="background-color: white" slot="avatar" src="https://gw.alipayobjects.com/zos/rmsportal/kISTdvpyTAhtGxpovNWd.png"/>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
            <a-button @click="toSiteMessage" type="dashed" block>查看更多</a-button>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef">
      <a-badge :count="333">
        <a-icon style="font-size: 16px;" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>

import { axios } from '@/utils/request'

export default {
  name: 'HeaderNotice',
  data () {
    return {
      // 事件标示
      loading: false,
      visible: false
    }
  },
  methods: {
    // 打开列表页
    fetchNotice () {
      this.visible = true
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 250)
    },
    /**
     * 接到推送的消息
     */
    receivedNewMsg () {
      // 查询当前用户消息数量
    },
    /**
     * 跳转到站内信界面
     */
    toSiteMessage () {
      this.$router.push({
        path: '/person/siteMessage'
      })
    },
    /**
     * 跳转到我的代办任务
     */
    toTaskList () {
      this.$router.push({
        path: '/person/taskList'
      })
    }
  },
  mounted () {
    this.receivedNewMsg()
    this.$bus.on('event_message_update', this.receivedNewMsg)
  },
  destroyed () {
    this.$bus.off()
  }
}
</script>

<style lang="css">
</style>
<style lang="less" scoped>
.header-notice{
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>
