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
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    ></vxe-table>

  </a-drawer>
</template>

<script>
import { tree } from '@/api/system/menu'
import { treeDataTranslate } from '@/utils/util'
import { findIdsByRole } from '@/api/system/roleMenu'

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
      await tree().then(res => {
        this.treeData = treeDataTranslate(res.data, 'id', 'title')
      })
      await findIdsByRole(roleId).then(res => {
        this.checkedKeys = res.data
      })
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
