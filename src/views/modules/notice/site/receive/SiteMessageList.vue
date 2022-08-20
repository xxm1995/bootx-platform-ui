<template>
  <a-card :bordered="false">
    <b-query
      :query-param="queryParam"
      :default-item-md="8"
      :disabled-query="superQueryFlag"
      :fields="fields"
      @query="query"
      @reset="() => queryParam = {}"/>
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
      <vxe-table-column field="haveRead" title="是否已读">
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
import { STRING, LIST } from '@/components/Bootx/SuperQuery/superQueryCode'
import { pageByReceive, read } from '@/api/notice/siteMessage'
import { NOTICE_MESSAGE_UPDATE, NOTICE_SHOW_MESSAGE } from '@/assets/code/VueBusCode'

export default {
  name: 'SiteMessageList',
  mixins: [TableMixin],
  data () {
    return {
      fields: [
        { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' },
        {
          field: 'haveRead',
          type: LIST,
          name: '是否已读',
          placeholder: '请选择是否已读',
          list: [{ label: '已读', value: 'true' }, { label: '未读', value: 'false' }]
        }
      ],
      queryParam: {
        title: '',
        haveRead: undefined
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
          this.$bus.emit(NOTICE_MESSAGE_UPDATE)
        })
      }
      this.$bus.emit(NOTICE_SHOW_MESSAGE, record)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
