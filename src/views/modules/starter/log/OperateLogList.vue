<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="操作模块">
              <a-input v-model="queryParam.title" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="queryParam.username" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
              <a-button @click="() => this.queryParam = {}">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>
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
      <vxe-table-column field="id" title="ID"/>
      <vxe-table-column field="operateId" title="操作人员ID" />
      <vxe-table-column field="username" title="操作人员" />
      <vxe-table-column field="title" title="操作模块" />
      <vxe-table-column field="success" title="状态">
        <template v-slot="{row}">
          <a-tag v-if="row.success" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="businessType" title="业务类型">
        <template v-slot="{row}">
          {{ dictConvert(logBusinessType,row.businessType) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="operateIp" title="IP" />
      <vxe-table-column field="errorMsg" title="错误消息" />
      <vxe-table-column field="operateTime" title="操作时间" />
      <vxe-table-column title="操作" fixed="right" width="120">
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
    <operate-log-info
      ref="operateLogInfo"
    />
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { operatePage } from '@/api/starter/log'
import OperateLogInfo from './OperateLogInfo'

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
      }
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
