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
      <span v-html="message.content" class="article-content"></span>
    </a-card>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { findById } from '@/api/notice/siteMessage'

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
    this.$bus.on('show_site_message', this.show)
  },
  destroyed () {
    this.$bus.off('show_site_message')
  }
}
</script>

<style lang="less" scoped>
.daily-article {
  .article-button {
    font-size: 1.2rem !important;
  }
  .ant-card-body {
    padding: 18px !important;
  }
  .ant-card-head {
    padding: 0 1rem;
  }
  .ant-card-meta {
    margin-bottom: 1rem;
  }
  .article-content {
    p {
      word-wrap: break-word;
      word-break: break-all;
      text-overflow: initial;
      white-space: normal;
      font-size: .9rem !important;
      margin-bottom: .8rem;
    }
  }
}
</style>
