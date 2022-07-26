<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="queryParam.account" placeholder="请输入账号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="终端">
              <a-select
                allowClear
                placeholder="请选择终端"
                v-model="queryParam.client">
                <a-select-option v-for="o in clients" :key="o.code">{{ o.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="登录方式">
              <a-select
                allowClear
                placeholder="请输入登录方式"
                v-model="queryParam.loginType">
                <a-select-option v-for="o in loginTypes" :key="o.code">{{ o.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
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
      <vxe-table-column field="account" title="账号" />
      <vxe-table-column field="login" title="状态">
        <template v-slot="{row}">
          <a-tag v-if="row.login" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="ip" title="IP" />
      <vxe-table-column field="client" title="终端">
        <template v-slot="{row}">
          {{ getClient(row.client) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="loginType" title="登录方式">
        <template v-slot="{row}">
          {{ getLoginType(row.loginType) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="browser" title="浏览器类型" />
      <vxe-table-column field="os" title="操作系统" />
      <vxe-table-column field="msg" title="提示消息" />
      <vxe-table-column field="loginTime" title="访问时间" />
      <vxe-table-column title="操作" fixed="right" width="50">
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
    <login-log-info
      :clients="clients"
      :login-types="loginTypes"
      ref="loginLogInfo"
    />
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { loginPage } from '@/api/starter/log'
import LoginLogInfo from './LoginLogInfo'
import { findAll as findClients } from '@/api/system/client'
import { findAll as findLoginTypes } from '@/api/system/loginType'
import { findOneByField } from '@/utils/entityUtil'

export default {
  name: 'LoginLogList',
  mixins: [TableMixin],
  components: {
    LoginLogInfo
  },
  data () {
    return {
      clients: [],
      loginTypes: [],
      queryParam: {
        account: '',
        client: undefined,
        loginType: undefined
      }
    }
  },
  methods: {
    /**
     * 初始化 终端列表和登录方式列表
     */
    initClientAndLoginType () {
      findClients().then(({ data }) => {
        this.clients = data
      })
      findLoginTypes().then(({ data }) => {
        this.loginTypes = data
      })
    },
    init () {
      this.loading = true
      loginPage({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    show (record) {
      this.$refs.loginLogInfo.init(record.id, 'show')
    },
    getClient (code) {
      return findOneByField(this.clients, code, 'code')?.['name']
    },
    getLoginType (code) {
      console.log(this.loginTypes)
      return findOneByField(this.loginTypes, code, 'code')?.['name']
    }
  },
  created () {
    this.initClientAndLoginType()
    this.init()
  }
}
</script>

<style scoped>

</style>
