<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="终端">
              <a-select
                v-model="clientCode"
                @change="init"
                :default-value="clientCode"
                style="width: 100%"
              >
                <a-select-option v-for="o in clients" :key="o.code">{{ o.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
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
        <a-button style="margin-left: 8px" @click="allTreeExpand(true)">展开所有</a-button>
        <a-button style="margin-left: 8px" @click="allTreeExpand(false)">关闭所有</a-button>
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
          <a href="javascript:" @click="show(row.id)">查看</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="resourceList(row)">权限资源</a>
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
                <a @click="copy(row.id)">复制</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:" :disabled="row.admin" @click="edit(row.id)">编辑</a>
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
import { menuTree, del } from '@/api/system/permMenu'
import MenuEdit from './MenuEdit'
import ResourcePermList from './ResourcePermList'
import { TableMixin } from '@/mixins/TableMixin'
import XEUtils from 'xe-utils'
import { findAllByAlonePrem } from '@/api/system/client'

export default {
  name: 'MenuList',
  components: {
    MenuEdit,
    ResourcePermList
  },
  mixins: [TableMixin],
  data () {
    return {
      // 终端编码
      clientCode: 'admin',
      clients: [],
      searchName: '',
      // 默认树关闭
      treeExpand: false,
      remoteTableData: []
    }
  },
  methods: {
    init () {
      this.loading = true
      menuTree(this.clientCode).then(res => {
        this.remoteTableData = res.data
        this.search()
        this.loading = false
      })
    },
    add () {
      this.$refs.menuEdit.init('', 'add',null,this.clientCode)
    },
    addChildren (row) {
      this.$refs.menuEdit.init('', 'addChildren', row, this.clientCode)
    },
    copy (id) {
      this.$refs.menuEdit.init(id, 'copy', null, this.clientCode)
    },
    edit (id) {
      this.$refs.menuEdit.init(id, 'edit', null, this.clientCode)
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
    // 初始化终端列表
    async initClients () {
      const { data } = await findAllByAlonePrem()
      this.clients = data
    },
    /**
     * 资源列表
     */
    resourceList (record) {
      this.$refs.resourcePermList.init(record)
    },
    /**
     * 展开or关闭
     */
    allTreeExpand (treeExpand) {
      this.$nextTick(() => {
        this.$refs.xTree.setAllTreeExpand(treeExpand)
      })
      this.treeExpand = treeExpand
    },
    /**
     * 搜索
     */
    search () {
      const searchName = XEUtils.toValueString(this.searchName).trim().toLowerCase()
      let treeExpand = this.treeExpand
      if (searchName) {
        const searchProps = ['name', 'title', 'path', 'component']
        this.tableData = XEUtils.searchTree(this.remoteTableData, item =>
          searchProps.some(key => XEUtils.toValueString(item[key]).toLowerCase().indexOf(searchName) > -1))
        // 搜索状态默认展开
        treeExpand = true
      } else {
        this.tableData = this.remoteTableData
      }
      this.$nextTick(() => {
        this.$refs.xTree.setAllTreeExpand(treeExpand)
      })
    }
  },
  created () {
    this.initClients()
    this.init()
  }
}
</script>

<style scoped>

</style>
