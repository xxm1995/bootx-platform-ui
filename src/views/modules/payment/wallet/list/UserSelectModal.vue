<template>
  <a-modal
    title="选择开通钱包的用户"
    destroyOnClose
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <vxe-toolbar>
      <template #buttons>
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
      :checkbox-config="{reserve: true}"
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
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" @click="handleOk">选择</a-button>
    </template>
  </a-modal>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { pageByNotWallet } from '@/api/payment/wallet'

export default {
  name: 'UserSelectModal',
  mixins: [TableMixin],
  data () {
    return {
      visible: false,
      queryParam: {
        code: '',
        name: ''
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.queryPage()
    },
    queryPage () {
      this.loading = true
      pageByNotWallet({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
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
