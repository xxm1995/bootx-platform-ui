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
    <vxe-table
      resizable
      border
      stripe
      show-overflow
      :showHeader="false"
      row-id="id"
      size="medium"
      :checkbox-config="{trigger: 'row', highlight: true, range: true}"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="checkbox" width="60"/>
      <vxe-table-column field="code" title="权限代码" />
      <vxe-table-column field="name" title="权限名称" />
    </vxe-table>

  </a-drawer>
</template>

<script>
import { findAll } from '@/api/system/path'

export default {
  name: 'RolePathModal',
  data () {
    return {
      title: '角色权限配置',
      roleId: '',
      selectedKeys: [],
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
      await findAll().then(res => {
        this.tableData = res.data
      })
      // await findIdsByRole(roleId).then(res => {
      //   this.checkedKeys = res.data
      // })
      this.loading = false
    },
    handleCancel () {
      this.visible = false
    }
  }

}
</script>

<style scoped>

</style>
