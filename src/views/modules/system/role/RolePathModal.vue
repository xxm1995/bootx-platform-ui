<template>
  <a-drawer
    :title="title"
    :maskClosable="false"
    :width="1000"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <a-spin :spinning="loading" style="margin-bottom: 2rem">
      <vxe-table
        :stripe="false"
        border="none"
        ref="table"
        size="medium"
        row-id="id"
        :showHeader="true"
        :tree-config="{children: 'children'}"
        :checkbox-config="{labelField: 'name', checkRowKeys: checkedKeys}"
        :loading="loading"
        :data="tableData">
        <vxe-column type="checkbox" title="权限名称" tree-node/>
        <vxe-column field="code" title="权限代码"></vxe-column>
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
import XEUtils from 'xe-utils'

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
    async init (roleId) {
      this.visible = true
      this.loading = true
      this.roleId = roleId
      await findIdsByRole(roleId).then(res => {
        this.checkedKeys = res.data
      })
      await findPathsByUser().then(res => {
        const result = []
        XEUtils.each(XEUtils.groupBy(res.data, 'groupName'), (childs, key) => {
          result.push({
            name: key,
            children: childs
          })
        })
        this.tableData = result
        this.$refs.table.reloadData(this.tableData)
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
        .filter(id => id.indexOf('row_') === -1)
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
