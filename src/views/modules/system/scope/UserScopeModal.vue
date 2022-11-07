<template>
  <a-drawer
    title="用户范围权限分配"
    :maskClosable="false"
    width="50%"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <vxe-toolbar
      custom
      :refresh="{query: queryList}"
    >
      <template #buttons>
        <a-button type="primary" icon="usergroup-add" @click="selectUserShow">选择用户</a-button>
        <a-popconfirm
          title="是否删除这些关联的用户"
          @confirm="deleteUser()"
          okText="是"
          cancelText="否">
          <a-button v-show="selectIds.length > 0" type="danger" icon="usergroup-delete" style="margin-left: 5px">删除</a-button>
        </a-popconfirm>
      </template>
    </vxe-toolbar>
    <vxe-table
      @checkbox-change="checkboxChange"
      @checkbox-all="checkboxChange"
      row-id="id"
      ref="table"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="checkbox" width="40"/>
      <vxe-column field="name" title="用户名称" />
      <vxe-column field="username" title="用户账号" />
    </vxe-table>
    <b-user-select-modal ref="userSelectModal" @ok="selectUser" title="选择指定用户" :multiple="true"/>
  </a-drawer>
</template>

<script>

import { TableMixin } from '@/mixins/TableMixin'
import { deleteBatchUserAssign, findUsersByDataScopeId, saveUserAssign } from '@/api/system/dataScope'
import BUserSelectModal from '@/components/Bootx/UserSelectModal/BUserSelectModal'

export default {
  name: 'UserScopeModal',
  mixins: [TableMixin],
  components: {
    BUserSelectModal
  },
  data () {
    return {
      dataScopeId: '',
      selectIds: [],
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
    // 查询关联用户信息
    async queryList () {
      this.loading = true
      await findUsersByDataScopeId(this.dataScopeId).then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    // 打开选择用户窗口
    selectUserShow () {
      const userIds = this.tableData.map(res => res.userId)
      this.$refs.userSelectModal.init(userIds)
    },
    // 多选变动事件
    checkboxChange () {
      this.selectIds = this.$refs.table.getCheckboxRecords().map(res => res.id)
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
    // 删除用户关联消息
    deleteUser () {
      this.loading = true
      deleteBatchUserAssign(this.selectIds).then(_ => {
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
