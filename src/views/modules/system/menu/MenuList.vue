<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="查询">
              <a-input v-model="searchName" @change="search" allow-clear placeholder="请输入菜单名称、路由名称、请求路径或组件名称" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <vxe-toolbar
      custom
      export
      print
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
      show-overflow
      border="inner"
      ref="xTree"
      :loading="loading"
      :tree-config="{children: 'children'}"
      :data="tableData"
    >
      <vxe-table-column field="title" title="菜单名称" tree-node />
      <vxe-table-column field="name" title="路由名称" />
      <vxe-table-column field="menuType" title="菜单类型">
        <template v-slot="{row}">
          <span v-show="String(row.menuType) === '0'">一级菜单</span>
          <span v-show="String(row.menuType) === '1'">子菜单</span>
          <span v-show="String(row.menuType) === '2'">按钮/权限</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="path" title="请求路径"/>
      <vxe-table-column field="sortNo" title="排序" :visible="false"/>
      <vxe-table-column field="component" title="组件" />
      <vxe-table-column field="icon" title="图标">
        <template v-slot="{row}">
          <div v-if="row.icon !== ''">
            <a-icon :type="row.icon"/>
          </div>
        </template>
      </vxe-table-column>
      <vxe-table-column title="操作" fixed="right" width="210" :showOverflow="false" >
        <template v-slot="{row}">
          <a href="javascript:" :disabled="row.admin" @click="edit(row.id)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="show(row.id)">查看</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="resourceList(row)">资源</a>
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
                  title="是否删除菜单或权限"
                  @confirm="remove(row)"
                  okText="是"
                  cancelText="否">
                  <a href="javascript:" v-if="!row.admin" style="color: red">删除</a>
                  <a href="javascript:" v-else disabled>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </vxe-table-column>
    </vxe-table>
    <menu-edit ref="menuEdit" @ok="handleOk"/>
    <resource-perm-list ref="resourcePermList"/>
  </a-card>
</template>

<script>
import { tree, del } from '@/api/system/permMenu'
import MenuEdit from './MenuEdit'
import ResourcePermList from './ResourcePermList'
import { TableMixin } from '@/mixins/TableMixin'
import XEUtils from 'xe-utils'

export default {
  name: 'MenuList',
  components: {
    MenuEdit,
    ResourcePermList
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
      this.$refs.menuEdit.init('', 'add')
    },
    addChildren (row) {
      this.$refs.menuEdit.init('', 'add', row)
    },
    edit (id) {
      this.$refs.menuEdit.init(id, 'edit')
    },
    show (id) {
      this.$refs.menuEdit.init(id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    /**
     * 资源列表
     */
    resourceList (record) {
      this.$refs.resourcePermList.init(record)
    },
    /**
     * 搜索
     */
    search () {
      const searchName = XEUtils.toValueString(this.searchName).trim().toLowerCase()
      if (searchName) {
        const searchProps = ['name', 'title', 'path', 'component']
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
