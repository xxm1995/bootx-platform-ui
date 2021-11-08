<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="queryParam.account" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="终端">
              <a-input v-model="queryParam.client" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
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
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column field="id" title="ID"/>
      <vxe-table-column field="userId" title="用户ID" />
      <vxe-table-column field="account" title="账号" />
      <vxe-table-column field="login" title="状态">
        <template v-slot="{row}">
          <a-tag v-if="row.login" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="ip" title="IP" />
      <vxe-table-column field="client" title="终端" />
      <vxe-table-column field="browser" title="浏览器类型" />
      <vxe-table-column field="os" title="操作系统" />
      <vxe-table-column field="msg" title="提示消息" />
      <vxe-table-column field="loginTime" title="访问时间" />
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
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handleTableChange">
    </vxe-pager>
    <login-log-info
      ref="loginLogInfo"
    />
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { loginPage } from '@/api/system/log'
import LoginLogInfo from './LoginLogInfo'

export default {
  name: 'LoginLogList',
  mixins: [TableMixin],
  components: {
    LoginLogInfo
  },
  data () {
    return {
      queryParam: {
        account: '',
        client: ''
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      loginPage({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.tableData = res.data.records
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    show (record) {
      this.$refs.loginLogInfo.init(record.id, 'show')
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
