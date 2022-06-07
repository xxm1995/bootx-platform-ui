<template>
  <a-modal
    title="数据范围权限管理"
    destroyOnClose
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <vxe-toolbar>
      <template v-slot:buttons>
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="12">
              <a-col :md="8" :sm="12">
                <a-form-item label="名称">
                  <a-input v-model="queryParam.name" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="12">
                <a-form-item label="账号">
                  <a-input v-model="queryParam.username" placeholder="" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-button type="primary" @click="queryPage">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </template>
    </vxe-toolbar>
    <vxe-table
      :height="350"
      row-id="id"
      ref="table"
      :checkbox-config="{reserve: true,checkMethod: banCheckbox}"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="checkbox" width="40"/>
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
      @page-change="handleTableChange">
    </vxe-pager>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" @click="handleOk">选择</a-button>
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
      // 已经被选择的用户
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
    },
    // 禁止选中的行
    banCheckbox ({ row }) {
      return !this.selectUserIds.includes(row.id)
    }
  }
}
</script>

<style scoped>

</style>
