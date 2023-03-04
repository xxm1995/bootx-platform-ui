<template>
  <a-card :bordered="false">
    <b-query
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
      <template v-slot:buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="code" title="编码"/>
      <vxe-column field="name" title="名称"/>
      <vxe-column field="captcha" title="系统内置" >
        <template v-slot="{row}">
          <a-tag v-if="row.system" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="enable" title="启用状态" >
        <template v-slot="{row}">
          <a-tag v-if="row.enable" color="green">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="description" title="描述"/>
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
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
            title="是否删除"
            :disabled="row.system"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" :disabled="row.system" :style="{color: row.system?'rgba(0, 0, 0, 0.25)':'red'}">删除</a>
          </a-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <client-edit
      ref="clientEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { page, del } from '@/api/system/client'
import ClientEdit from './ClientEdit'
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'ClientList',
  components: {
    ClientEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        code: '',
        name: ''
      },
      fields: [
        { field: 'code', formType: STRING, name: '编码', placeholder: '请输入终端编码' },
        { field: 'name', formType: STRING, name: '名称', placeholder: '请输入终端名称' }
      ]
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
    add () {
      this.$refs.clientEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.clientEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.clientEdit.init(record.id, 'show')
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
