<template>
  <a-drawer
    title="权限资源列表"
    :visible="visible"
    :maskClosable="true"
    :width="1000"
    placement="right"
    :closable="true"
    @close="handleCancel">
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: queryList}"
    >
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60"/>
      <vxe-column field="title" title="资源名称" />
      <vxe-column field="permCode" title="权限编码" />
      <vxe-column field="effect" title="是否有效">
        <template v-slot="{row}">
          <a-tag v-if="row.effect" color="green">有效</a-tag>
          <a-tag v-else color="red">无效</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" />
      <vxe-column title="操作" fixed="right" width="200" :showOverflow="false">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <a href="javascript:" :disabled="row.admin" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除字典项"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" :disabled="row.admin" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <resource-perm-edit ref="resourcePermEdit" @ok="queryList"/>
  </a-drawer>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, resourceList } from '@/api/system/permMenu.js'
import ResourcePermEdit from './ResourcePermEdit'
export default {
  name: 'ResourcePermList',
  mixins: [ TableMixin ],
  components: {
    ResourcePermEdit
  },
  data () {
    return {
      visible: false,
      menu: {}
    }
  },
  methods: {
    init (menu) {
      this.visible = true
      this.menu = menu
      this.queryList()
    },
    queryList () {
      this.loading = true
      resourceList(this.menu.id).then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    add () {
      this.$refs.resourcePermEdit.init(this.menu, 'add')
    },
    edit (record) {
      this.$refs.resourcePermEdit.init(record, 'edit')
    },
    show (record) {
      this.$refs.resourcePermEdit.init(record, 'show')
    },
    remove (record) {
      del(record.id).then(() => {
        this.$message.info('删除成功')
        this.queryList()
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
