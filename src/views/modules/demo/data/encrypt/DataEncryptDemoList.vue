<template>
  <a-card :bordered="false">
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
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="content" title="要加密的内容" />
      <vxe-table-column field="contentEncryption" title="加密后的内容" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="150" :showOverflow="false" title="操作">
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
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <data-encrypt-demo-edit ref="dataEncryptDemoEdit" @ok="init"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, page } from '@/api/demo/dataEncryptDemo'
import DataEncryptDemoEdit from './DataEncryptDemoEdit'

export default {
  name: 'DataEncryptDemoList',
  mixins: [TableMixin],
  components: {
    DataEncryptDemoEdit
  },
  data () {
    return {
      queryParam: {
        name: '',
        creatorName: '',
        remark: ''
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
    add () {
      this.$refs.dataEncryptDemoEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.dataEncryptDemoEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dataEncryptDemoEdit.init(record.id, 'show')
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
