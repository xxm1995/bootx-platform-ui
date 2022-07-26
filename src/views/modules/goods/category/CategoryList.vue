<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="8" :sm="24">
            <a-form-item label="查询">
              <a-input v-model="searchName" @change="search" allow-clear placeholder="请输入类目名称" />
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
      <template #buttons>
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
      row-id="id"
      resizable
      border="inner"
      ref="xTree"
      :tree-config="{children: 'children'}"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column field="name" title="名称" tree-node/>
      <vxe-table-column field="enable" title="状态">
        <template v-slot="{row}">
          {{ row.enable ? '启用':'停用' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="描述"/>
      <vxe-table-column title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item v-if="row.level !== 3">
                  <a @click="addChildren(row)">添加下级</a>
                </a-menu-item>
                <a-menu-item v-if="row.level === 3">
                  <a @click="bindBrand(row)">绑定品牌</a>
                </a-menu-item>
                <a-menu-item v-if="row.level === 3">
                  <a @click="bindSpec(row)">绑定规格</a>
                </a-menu-item>
                <a-menu-item v-if="row.level === 3">
                  <a @click="bindParameter(row)">绑定参数</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否删除该类目"
                    @confirm="remove(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:">删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </vxe-table-column>
    </vxe-table>
    <category-edit ref="categoryEdit" @ok="handleOk"/>
    <bind-brand-model ref="bindBrandModel"/>
    <bind-spec-model ref="bindSpecModel"/>
  </a-card>
</template>

<script>
import { findTree, del } from '@/api/goods/category'
import { TableMixin } from '@/mixins/TableMixin'
import CategoryEdit from './CategoryEdit'
import BindBrandModel from './BindBrandModel'
import BindSpecModel from './BindSpecModel'
import XEUtils from 'xe-utils'

export default {
  name: 'CategoryList',
  components: {
    CategoryEdit,
    BindBrandModel,
    BindSpecModel
  },
  mixins: [TableMixin],
  data () {
    return {
      remoteTableData: [],
      searchName: '',
      queryParam: {
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      findTree().then(res => {
        this.remoteTableData = res.data
        this.search()
        this.loading = false
      })
    },
    add () {
      this.$refs.categoryEdit.init('', 'add')
    },
    addChildren (row) {
      this.$refs.categoryEdit.init('', 'add', row)
    },
    edit (record) {
      this.$refs.categoryEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.categoryEdit.init(record.id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    /**
     * 绑定参数
     */
    bindParameter (record) {
      this.$router.push({ name: 'ParameterGroup', query: { categoryId: record.id } })
    },
    /**
     * 绑定品牌
     */
    bindBrand (record) {
      this.$refs.bindBrandModel.init('', '', record)
    },
    /**
     * 绑定规格
     */
    bindSpec (record) {
      this.$refs.bindSpecModel.init('', '', record)
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
        const searchProps = ['name']
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
    this.init()
  }
}
</script>

<style scoped>

</style>
