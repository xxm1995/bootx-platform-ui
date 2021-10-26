<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-model="queryParam.code" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="" />
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
    >
      <template v-slot:buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
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
      <vxe-table-column field="code" title="编号" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="host" title="地址" />
      <vxe-table-column field="port" title="端口" />
      <vxe-table-column field="username" title="账号" />
      <vxe-table-column field="sender" title="发送人" />
      <vxe-table-column field="from" title="from" />
      <vxe-table-column field="enable" title="启用状态" >
        <template v-slot="{row}">
          <a-tag v-if="row.activity" color="green">启用</a-tag>
          <a-tag v-else color="red">未启用</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="securityType" title="安全方式" >
        <template v-slot="{row}">
          {{ dictConvert(mailSecurityCode,row.securityType) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="160" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm
                  title="是否设为默认配置"
                  @confirm="setUpActivity(row)"
                  okText="是"
                  cancelText="否">
                  <a href="javascript:">设为默认</a>
                </a-popconfirm>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                  title="是否删除配置"
                  @confirm="remove(row)"
                  okText="是"
                  cancelText="否">
                  <a href="javascript:" style="color: red">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
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
      />
    </vxe-pager>
    <mail-config-edit
      ref="mailConfigEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, page, setUpActivity } from '@/api/notice/mailConfig'
import MailConfigEdit from './MailConfigEdit'
export default {
  name: 'EmailConfigList',
  mixins: [TableMixin],
  components: {
    MailConfigEdit
  },
  data () {
    return {
      mailSecurityCode: 'MailSecurityCode',
      queryParam: {
        code: '',
        name: ''
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.tableData = res.data.records
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    // 设置默认配置
    setUpActivity (record) {
      setUpActivity(record.id).then(_ => {
        this.$message.info('设置成功')
        this.init()
      })
    },
    add () {
      this.$refs.mailConfigEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.mailConfigEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.mailConfigEdit.init(record.id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
