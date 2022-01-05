<template>
  <a-modal
    title="数据范围权限管理"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: queryPage}"
    >
      <template v-slot:buttons>
        <a-button type="primary" icon="plus">选择用户</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      ref="table"
      size="medium"
      :checkbox-config="{reserve: true,checkRowKeys: selectUserIds}"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="checkbox" width="60"/>
      <vxe-table-column field="name" title="用户名称" />
      <vxe-table-column field="username" title="用户账号" />
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      :page-sizes="[3,5,10]"
      @page-change="handleTableChange">
    </vxe-pager>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { page } from '@/api/system/user'
import { TableMixin } from '@/mixins/TableMixin'

export default {
  name: 'UserSelectModal',
  mixins: [TableMixin],
  data () {
    return {
      selectUserIds: [],
      visible: false,
      queryParam: {
        code: '',
        name: ''
      }
    }
  },
  methods: {
    init (selectUserIds) {
      this.visible = true
      this.selectUserIds = selectUserIds
      this.queryPage()
    },
    queryPage () {
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
    handleOk () {
      // 非本页选中的
      const reserveUsers = this.$refs.table.getCheckboxReserveRecords()
      // 本页选中的
      const checkUsers = this.$refs.table.getCheckboxRecords()
      const userIds = reserveUsers.concat(checkUsers).map(res => res.id)
      this.visible = false
      this.$emit('ok', userIds)
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
