<template>
  <a-card :bordered="false">
    <b-query
      query-param="queryParam"
      v-model="queryParam"
      :fields="fields"
      :default-item-md="8"
      @query="query"
      @reset="() => queryParam = {}"
    />
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="code" title="编号" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="host" title="地址" />
      <vxe-column field="port" title="端口" />
      <vxe-column field="username" title="账号" />
      <vxe-column field="sender" title="发送人" />
      <vxe-column field="from" title="from" />
      <vxe-column field="enable" title="启用状态" >
        <template v-slot="{row}">
          <a-tag v-if="row.activity" color="green">启用</a-tag>
          <a-tag v-else color="red">未启用</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="securityType" title="安全方式" >
        <template v-slot="{row}">
          {{ dictConvert(mailSecurityCode,row.securityType) }}
        </template>
      </vxe-column>
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="160" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
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
            </template>
          </a-dropdown>
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
    <mail-config-edit
      ref="mailConfigEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, page, setUpActivity } from '@/api/notice/mailConfig'
import MailConfigEdit from './MailConfigEdit'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'EmailConfigList',
  mixins: [TableMixin],
  components: {
    MailConfigEdit
  },
  data () {
    return {
      mailSecurityCode: 'MailSecurityCode',
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
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
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
