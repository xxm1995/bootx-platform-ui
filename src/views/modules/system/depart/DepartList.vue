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
      :loading="loading"
      :tree-config="{children: 'children'}"
      :data="tableData"
    >
      <vxe-table-column field="departName" title="机构/部门名称" tree-node/>
      <vxe-table-column field="departNameAbbr" title="缩写"/>
      <vxe-table-column field="orgCategory" title="机构类别">
        <template v-slot="{row}">
          <span v-show="String(row.orgCategory) === '1'">组织机构</span>
          <span v-show="String(row.orgCategory) === '2'">岗位</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template v-slot="{row}">
          <a-tag v-if="row.status" color="green">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="edit(row.id)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="show(row.id)">查看</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否删除菜单或权限"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-table-column>
    </vxe-table>
    <depart-edit
      ref="departEdit"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { tree, del } from '@/api/system/depart.js'
import DepartEdit from './DepartEdit'
import { TableMixin } from '@/mixins/TableMixin'
export default {
  name: 'DepartList',
  components: {
    DepartEdit
  },
  mixins: [TableMixin],
  data () {
    return {

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
      this.$refs.departEdit.init('', 'add')
    },
    edit (id) {
      this.$refs.departEdit.init(id, 'edit')
    },
    show (id) {
      this.$refs.departEdit.init(id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
