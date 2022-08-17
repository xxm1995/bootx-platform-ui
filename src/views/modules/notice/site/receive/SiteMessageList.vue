<template>
  <a-card :bordered="false">
    <b-query
      :query-param="queryParam"
      :default-item-md="8"
      :disabled-query="superQueryFlag"
      :fields="fields"
      @query="query"
      @reset="resetQuery"/>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
    </vxe-toolbar>
    <vxe-table
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="title" title="标题">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">{{ row.title }}</a>
        </template>
      </vxe-table-column>
      <vxe-table-column field="senderTime" title="发送时间" />
      <vxe-table-column field="type" title="是否已读">
        <template v-slot="{row}">
          <a-tag color="green" v-if="row.haveRead">已读</a-tag>
          <a-tag v-else color="red">未读</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column fixed="right" width="70" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
    </vxe-pager>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { pageByReceive, read } from '@/api/notice/siteMessage'

export default {
  name: 'SiteMessageList',
  mixins: [TableMixin],
  data () {
    return {
      fields: [
        { field: 'code', type: STRING, name: '编码', placeholder: '请输入编码' },
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' }
      ],
      queryParam: {
        code: '',
        name: ''
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      pageByReceive({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    show (record) {
      if (!record.haveRead) {
        read(record.id).then(() => {
          record.haveRead = true
          this.$bus.emit('received_count')
        })
      }
      this.$bus.emit('show_site_message', record)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
