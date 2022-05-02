<template>
  <a-card :bordered="false">
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
      <vxe-table-column field="userId" title="用户ID" />
      <vxe-table-column field="name" title="用户名称" />
      <vxe-table-column field="userName" title="用户账号" />
      <vxe-table-column field="timeout" title="剩余有效时间(秒)" />
      <vxe-table-column field="creationTime" title="创建时间" />
      <vxe-table-column field="tokenSigns" title="登录终端">
        <template v-slot="{row}">
          <a-tag :key="device" v-for="{device} in row.tokenSigns" color="green">{{ device }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" fixed="right" width="120">
        <template v-slot="{row}">
          <a-popconfirm
            title="是否将该用户踢下线"
            @confirm="remove(row.userId)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">强退</a>
          </a-popconfirm>
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
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { page, logoutByUserId } from '@/api/system/online'
export default {
  name: 'OnlineUserList',
  mixins: [TableMixin],
  data () {
    return {

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
    remove (userId) {
      logoutByUserId(userId).then(() => {
        this.$message.info('强退成功')
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
