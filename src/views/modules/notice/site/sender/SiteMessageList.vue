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
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="title" title="标题">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">{{ row.title }}</a>
        </template>
      </vxe-column>
      <vxe-column field="receiveType" title="接收类型">
        <template v-slot="{row}">
          {{ dictConvert('SiteMessageReceive',row.receiveType) }}
        </template>
      </vxe-column>
      <vxe-column field="sendState" title="发布状态">
        <template v-slot="{row}">
          {{ dictConvert('SiteMessageState',row.sendState) }}
        </template>
      </vxe-column>
      <vxe-column field="senderTime" title="发送时间" />
      <vxe-column field="efficientTime" title="截至有效期" />
      <vxe-column fixed="right" width="200" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <template v-if="row.sendState === 'draft'">
            <a-divider type="vertical"/>
            <span>
              <a href="javascript:" @click="edit(row)">编辑</a>
            </span>
            <a-divider type="vertical"/>
            <a-popconfirm
              title="是否发送消息"
              @confirm="send(row)"
              okText="是"
              cancelText="否">
              <a href="javascript:">发送</a>
            </a-popconfirm>
          </template>
          <template v-if="row.sendState === 'sent'">
            <a-divider type="vertical"/>
            <a-popconfirm
              title="是否撤回消息"
              @confirm="cancel(row)"
              okText="是"
              cancelText="否">
              <a href="javascript:" style="color: red">撤回</a>
            </a-popconfirm>
          </template>
          <template v-if="['draft'].includes(row.sendState)">
            <a-divider type="vertical"/>
            <a-popconfirm
              title="是否删除消息"
              @confirm="remove(row)"
              okText="是"
              cancelText="否">
              <a href="javascript:" style="color: red">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </vxe-column>
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
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { LIST, STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { pageBySender, del, cancel, send } from '@/api/notice/siteMessage'
import SiteMessageEdit from './SiteMessageEdit'
import { NOTICE_SHOW_MESSAGE } from '@/assets/code/VueBusCode'

export default {
  name: 'SiteMessageList',
  components: { SiteMessageEdit },
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
      this.$bus.emit(NOTICE_SHOW_MESSAGE, record)
    },
    /**
     * 发送
     */
    send (record) {
      send(record.id).then(() => {
        this.$message.info('发送成功')
        this.init()
      })
    },
    /**
     * 撤回消息
     */
    cancel (record) {
      cancel(record.id).then(() => {
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
