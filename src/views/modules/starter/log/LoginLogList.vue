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
      <vxe-column field="account" title="账号" />
      <vxe-column field="login" title="状态">
        <template v-slot="{row}">
          <a-tag v-if="row.login" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="ip" title="IP" />
      <vxe-column field="client" title="终端">
        <template v-slot="{row}">
          {{ getClient(row.client) }}
        </template>
      </vxe-column>
      <vxe-column field="loginType" title="登录方式">
        <template v-slot="{row}">
          {{ getLoginType(row.loginType) }}
        </template>
      </vxe-column>
      <vxe-column field="browser" title="浏览器类型" />
      <vxe-column field="os" title="操作系统" />
      <vxe-column field="msg" title="提示消息" />
      <vxe-column field="loginTime" title="访问时间" />
      <vxe-column title="操作" fixed="right" width="50">
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
import { dropdownTranslate, findOneByField } from '@/utils/dataUtil'
import { LIST, STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

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
  computed: {
    fields () {
      return [
        { field: 'code', type: STRING, name: '账号', placeholder: '请输入账号名称' },
        { field: 'client', type: LIST, name: '终端', placeholder: '请选择终端', list: dropdownTranslate(this.clients, 'name', 'code') },
        { field: 'loginType', type: LIST, name: '登录方式', placeholder: '请选择登录方式', list: dropdownTranslate(this.loginTypes, 'name', 'code') }
      ]
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
