<template>
  <a-card :bordered="false">
    <b-query
      :query-param="queryParam"
      :default-item-md="6"
      :disabled-query="superQueryFlag"
      :fields="fields"
      @query="query"
      @reset="() => queryParam = {}"/>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">发布消息</a-button>
      </template>
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
      <vxe-table-column field="receiveType" title="接收类型">
        <template v-slot="{row}">
          {{ dictConvert('SiteMessageReceive',row.receiveType) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="sendState" title="发布状态">
        <template v-slot="{row}">
          {{ dictConvert('SiteMessageState',row.sendState) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="senderTime" title="发送时间" />
      <vxe-table-column field="efficientTime" title="截至有效期" />
      <vxe-table-column fixed="right" width="160" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否撤回消息"
            v-if="row.cancel === 'cancel'"
            @confirm="cancel(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
          <a-popconfirm
            title="是否删除消息"
            v-else
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
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
    <site-message-edit ref="siteMessageEdit" @ok="init"/>
    <site-message-show ref="siteMessageShow"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { LIST, STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { pageBySender, del, cancel } from '@/api/notice/siteMessage'
import SiteMessageEdit from '@/views/modules/notice/site/sender/SiteMessageEdit'
import SiteMessageShow from '@/views/modules/notice/site/sender/SiteMessageShow'

export default {
  name: 'SiteMessageList',
  components: { SiteMessageShow, SiteMessageEdit },
  mixins: [TableMixin],
  computed: {
    fields () {
      return [
        { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' },
        { field: 'receiveType', type: LIST, name: '接收类型', placeholder: '请选择接收类型', list: this.receiveTypeList },
        { field: 'sendState', type: LIST, name: '发送状态', placeholder: '请选择发送状态', list: this.sendStateList }
      ]
    }
  },
  data () {
    return {
      receiveTypeList: [],
      sendStateList: []
    }
  },
  methods: {
    /**
     * 初始化基础数据
     */
    initData () {
      this.getDictDropDownAsync('SiteMessageState').then(res => {
        this.sendStateList = res
      })
      this.getDictDropDownAsync('SiteMessageReceive').then(res => {
        this.receiveTypeList = res
      })
    },
    init () {
      this.loading = true
      pageBySender({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    add () {
      this.$refs.siteMessageEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.siteMessageEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.siteMessageShow.init(record.id, 'show')
    },
    /**
     * 撤回消息
     */
    cancel (record) {
      cancel(record.id).then(res => {
        this.$message.info('撤回成功')
        this.init()
      })
    },
    /**
     * 删除消息
     */
    remove (record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    }
  },
  created () {
    this.initData()
    this.init()
  }
}
</script>

<style scoped>

</style>
