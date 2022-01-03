<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="查询">
              <a-input v-model="searchName" @change="search" allow-clear placeholder="请输入部门名称或编码" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
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
        <a-button style="margin-left: 8px" @click="$refs.xTree.setAllTreeExpand(true)">展开所有</a-button>
        <a-button style="margin-left: 8px" @click="$refs.xTree.clearTreeExpand()">关闭所有</a-button>
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
      <vxe-table-column field="deptName" title="机构/部门名称" tree-node/>
      <vxe-table-column field="orgCategory" title="机构类别">
        <template v-slot="{row}">
          <span v-show="String(row.orgCategory) === '1'">公司</span>
          <span v-show="String(row.orgCategory) === '2'">组织机构</span>
<!--          <span v-show="String(row.orgCategory) === '3'">岗位</span>-->
        </template>
      </vxe-table-column>
      <vxe-table-column field="orgCode" title="机构编码"/>
      <vxe-table-column title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="edit(row.id)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="show(row.id)">查看</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="addChildren(row)">添加下级</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                  title="是否删除该部门组织"
                  @confirm="remove(row)"
                  okText="是"
                  cancelText="否">
                  <a href="javascript:">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </vxe-table-column>
    </vxe-table>
    <dept-edit
      ref="deptEdit"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { tree, del } from '@/api/system/dept.js'
import DeptEdit from './DeptEdit'
import { TableMixin } from '@/mixins/TableMixin'
import XEUtils from 'xe-utils'
export default {
  name: 'DeptList',
  components: {
    DeptEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      searchName: '',
      remoteTableData: []
    }
  },
  methods: {
    init () {
      this.loading = true
      tree().then(res => {
        this.remoteTableData = res.data
        this.search()
        this.loading = false
      })
    },
    add () {
      this.$refs.deptEdit.init('', 'add')
    },
    edit (id) {
      this.$refs.deptEdit.init(id, 'edit')
    },
    show (id) {
      this.$refs.deptEdit.init(id, 'show')
    },
    addChildren (row) {
      this.$refs.deptEdit.init('', 'add', row)
    },
    remove (record) {
      this.loading = true
      del(record.id).then(() => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    search () {
      const searchName = XEUtils.toValueString(this.searchName).trim().toLowerCase()
      if (searchName) {
        const searchProps = ['deptName', 'orgCode']
        this.tableData = XEUtils.searchTree(this.remoteTableData, item =>
          searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(searchName) > -1))
      } else {
        this.tableData = this.remoteTableData
      }
      // 默认展开子节点
      this.$nextTick(() => {
        this.$refs.xTree.setAllTreeExpand(true)
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
