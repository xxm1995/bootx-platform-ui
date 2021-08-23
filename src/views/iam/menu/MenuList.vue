<template>
  <a-card :bordered="false">
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-button
          type="primary"
          icon="plus"
          @click="add()">
          新建
        </a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      resizable
      border="inner"
      ref="xTree"
      :loading='loading'
      :tree-config="{children: 'children'}"
      :data="tableData"
    >
      <vxe-table-column field="name" title="菜单名称" tree-node></vxe-table-column>
      <vxe-table-column field="menuType" title="菜单类型">
        <template v-slot='{row}'>
          <span v-show="String(row.menuType) === '0'">一级菜单</span>
          <span v-show="String(row.menuType) === '1'">子菜单</span>
          <span v-show="String(row.menuType) === '2'">按钮/权限</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="icon" title="图标">
        <template v-slot="{row}">
          <div v-if="row.icon !== ''">
            <a-icon :type="row.icon"/>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="edit(row.id)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否删除菜单或权限"
            @confirm="deleteItem(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-table-column>
    </vxe-table>
    <menu-edit
      ref="menuEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { tree, delObj } from '@/api/iam/menu'
import MenuEdit from './MenuEdit'
export default {
  name: 'MenuList',
  components: {
    MenuEdit
  },
  data () {
    return {
      loading: false,
      visible: false,
      tableData: []
    }
  },
  methods: {
    init () {
      this.loading = true
      tree().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    add () {
      this.$refs.menuEdit.edit('', 'add')
      this.$refs.menuEdit.title = '新增'
    },
    edit (id) {
      this.$refs.menuEdit.edit(id, 'edit')
      this.$refs.menuEdit.title = '编辑'
    },
    deleteItem (record) {
      delObj(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    handleOk () {
      this.init()
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
