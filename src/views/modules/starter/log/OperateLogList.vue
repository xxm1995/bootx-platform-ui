<template>
  <a-card :bordered="false">
    <b-query
      v-model="queryParam"
      :fields="fields"
      :default-item-md="6"
      @query="query"
      @reset="() => queryParam = {}"
    />
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    />
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column field="id" title="ID"/>
      <vxe-column field="operateId" title="操作人员ID" />
      <vxe-column field="username" title="操作人员" />
      <vxe-column field="title" title="操作模块" />
      <vxe-column field="success" title="状态">
        <template v-slot="{row}">
          <a-tag v-if="row.success" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="businessType" title="业务类型">
        <template v-slot="{row}">
          {{ dictConvert(logBusinessType,row.businessType) }}
        </template>
      </vxe-column>
      <vxe-column field="operateIp" title="IP" />
      <vxe-column field="errorMsg" title="错误消息" />
      <vxe-column field="operateTime" title="操作时间" />
      <vxe-column title="操作" fixed="right" width="60">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
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
    <operate-log-info
      ref="operateLogInfo"
    />
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { operatePage } from '@/api/starter/log'
import OperateLogInfo from './OperateLogInfo'
import { LIST, STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { dropdownTranslate } from '@/utils/dataUtil'

export default {
  name: 'OperateLogList',
  mixins: [TableMixin],
  components: {
    OperateLogInfo
  },
  data () {
    return {
      logBusinessType: 'LogBusinessType',
      queryParam: {
        title: '',
        username: ''
      },
      fields: [
        { field: 'title', type: STRING, name: '操作模块', placeholder: '请输入操作模块' },
        { field: 'username', type: STRING, name: '账号', placeholder: '请输入账号名称' }
      ]
    }
  },
  methods: {
    init () {
      this.loading = true
      operatePage({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    show (record) {
      this.$refs.operateLogInfo.init(record.id, 'show')
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
