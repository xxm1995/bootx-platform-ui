<template>
  <a-modal
    title="通知消息"
    :visible="visible"
    :width="modelStyle.width"
    :bodyStyle="bodyStyle"
    :confirmLoading="confirmLoading"
    :maskClosable="true"
    @cancel="handleCancel">
    <a-card class="daily-article" :loading="confirmLoading">
      <a-card-meta
        :title="message.title"
        :description="'发布人：'+message.senderName + ' 发布时间： ' + message.senderTime">
      </a-card-meta>
      <a-divider />
      <div class="editor-content-view" v-html="message.content"/>
    </a-card>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { findById } from '@/api/notice/siteMessage'
import { NOTICE_SHOW_MESSAGE } from '@/assets/code/VueBusCode'

export default {
  name: 'SiteMessageReader',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      message: {
        title: '',
        content: '',
        senderName: '',
        senderTime: ''
      },
      bodyStyle: {
        padding: '0',
        maxHeight: (window.innerHeight * 0.6) + 'px',
        'overflow-y': 'auto'
      },
      modelStyle: {
        width: '60%',
        style: { top: '10px' },
        fullScreen: false
      }
    }
  },
  methods: {
    /**
     * 显示消息内容
     */
    show (row) {
      this.visible = true
      this.confirmLoading = true
      this.message = row
      findById(row.id).then(res => {
        this.message = res.data
        this.confirmLoading = false
      })
    },
    /**
     * 关闭
     */
    handleCancel () {
      this.visible = false
    }
  },
  mounted () {
    // 绑定查看站内信消息事件
    this.$bus.on(NOTICE_SHOW_MESSAGE, this.show)
  },
  destroyed () {
    this.$bus.off(NOTICE_SHOW_MESSAGE)
  }
}
</script>

<style lang="less" scoped>
</style>
