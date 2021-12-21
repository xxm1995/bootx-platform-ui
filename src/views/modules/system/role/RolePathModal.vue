<template>
  <a-drawer
    :title="title"
    :maskClosable="false"
    :width="800"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <a-spin :spinning="loading" style="margin-bottom: 2rem">
      <vxe-table
        resizable
        border="none"
        stripe
        show-overflow
        showHeader
        ref="table"
        row-id="id"
        size="medium"
        :checkbox-config="{trigger: 'row', highlight: true, range: true, checkRowKeys: checkedKeys}"
        :loading="loading"
        :data="tableData"
      >
        <vxe-column type="checkbox" width="60"/>
        <vxe-table-column field="code" title="权限代码" />
        <vxe-table-column field="name" title="权限名称" />
      </vxe-table>
    </a-spin>
    <div class="drawer-button">
      <a-button @click="handleCancel()" style="margin-right: .8rem">取消</a-button>
      <a-button @click="handleSubmit()" type="primary" :loading="loading" style="margin-right: 0.8rem">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { findPathsByUser, findIdsByRole, save } from '@/api/system/rolePath'

export default {
  name: 'RolePathModal',
  data () {
    return {
      title: '角色请求配置',
      roleId: '',
      checkedKeys: [],
      visible: false,
      loading: false,
      tableData: []
    }
  },
  methods: {
    init: async function (roleId) {
      this.visible = true
      this.loading = true
      this.roleId = roleId
      await findIdsByRole(roleId).then(res => {
        this.checkedKeys = res.data
      })
      await findPathsByUser().then(res => {
        this.$refs.table.reloadData(res.data)
        this.tableData = res.data
      })

      this.loading = false
    },
    // 全选
    checkALL () {
      this.$refs.table.setAllCheckboxRow(true)
    },
    // 全不选
    cancelCheckALL () {
      this.$refs.table.clearCheckboxRow()
    },
    handleSubmit () {
      this.loading = true
      const checkedKeys = this.$refs.table.getCheckboxRecords().map(res => res.id)
      save({
        roleId: this.roleId,
        permissionIds: checkedKeys
      }).then(() => {
        this.handleCancel()
      })
    },
    handleCancel () {
      this.visible = false
    }
  }

}
</script>

<style scoped>

</style>
