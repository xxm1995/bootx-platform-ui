<template>
  <a-drawer
    title="用户范围权限分配"
    :maskClosable="false"
    width="70%"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <vxe-toolbar
      custom
      :refresh="{query: queryList}"
    >
      <template v-slot:buttons>
        <a-button type="primary" icon="plus" @click="selectUserShow">选择用户</a-button>
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
      <vxe-table-column type="seq" title="序号" width="60"/>
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
      @page-change="handleTableChange">
    </vxe-pager>
    <user-select-modal ref="userSelectModal" @ok="selectUser"/>
  </a-drawer>
</template>

<script>

import { TableMixin } from '@/mixins/TableMixin'
import UserSelectModal from './UserSelectModal'
import { findUsersByDataScopeId, saveUserAssign } from '@/api/system/dataScope'

export default {
  name: 'UserScopeModal',
  mixins: [TableMixin],
  components: {
    UserSelectModal
  },
  data () {
    return {
      dataScopeId: '',
      loading: false,
      visible: false
    }
  },
  methods: {
    init (dataScopeId) {
      this.visible = true
      this.dataScopeId = dataScopeId
      this.queryList()
    },
    // 页面刷新
    queryList () {
      this.loading = true
      findUsersByDataScopeId(this.dataScopeId).then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    // 打开选择用户窗口
    selectUserShow () {
      this.$refs.userSelectModal.init([])
    },
    // 选中用户, 进行保存
    selectUser (userIds) {
      this.loading = true
      saveUserAssign({
        dataScopeId: this.dataScopeId,
        userIds
      }).then(_ => {
        this.queryList()
      })
    },
    // 取消
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
