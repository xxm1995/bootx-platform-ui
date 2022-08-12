<template>
  <a-modal
    title="选择文章"
    :width="750"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
      :radio-config="{highlight: true}"
      @radio-change="radioChange"
    >
      <vxe-column width="50" type="radio" />
      <vxe-table-column field="titles" title="标题"/>
      <vxe-table-column field="articleId" title="文章id"/>
      <vxe-table-column field="updateTime" title="上传时间" />
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button :loading="loading" type="primary" :disabled="!articleId" @click="handleOk">选择</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { page } from '@/api/third/weChatArticle'

export default {
  name: 'WeChatArticleSelect',
  mixins: [TableMixin],
  data () {
    return {
      visible: false,
      articleId: null,
      mediaTypes: []
    }
  },
  methods: {
    init () {
      this.articleId = null
      this.visible = true
      this.loading = true
      page({
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    handleOk () {
      this.$emit('ok', this.articleId)
      this.handleCancel()
    },
    handleCancel () {
      this.visible = false
    },
    radioChange ({ row }) {
      this.articleId = row.articleId
    }
  }
}
</script>

<style scoped>

</style>
