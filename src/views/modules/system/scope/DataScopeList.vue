<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="编码">
              <a-input v-model="queryParam.code" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <vxe-toolbar
      custom
      zoom
      export
      print
      import
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="code" title="编码" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="type" title="类型">
        <template slot-scope="{row}">
          <span v-show="row.type === 1">自身数据</span>
          <span v-show="row.type === 2">用户范围</span>
          <span v-show="row.type === 3">部门范围</span>
          <span v-show="row.type === 4">部门和用户范围</span>
          <span v-show="row.type === 5">全部数据</span>
          <span v-show="row.type === 6">所在部门</span>
          <span v-show="row.type === 7">所在及下级部门</span>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="210" :showOverflow="false" title="操作">
        <template slot-scope="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除该数据权限"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
          <template v-if="[2,3,4].includes(row.type)">
            <a-divider type="vertical"/>
            <a-dropdown>
              <a class="ant-dropdown-link">
                关联 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-if="[2,4].includes(row.type)">
                  <a href="javascript:" @click="handleUserScope(row)">关联用户</a>
                </a-menu-item>
                <a-menu-item v-if="[3,4].includes(row.type)">
                  <a href="javascript:" @click="handleDeptScope(row)">关联部门</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </template>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
    </vxe-pager>
    <data-scope-edit ref="dataScopeEdit" @ok="handleOk"/>
    <dept-scope-modal ref="deptScopeModal"/>
    <user-scope-modal ref="userScopeModal"/>
  </a-card>

</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, page } from '@/api/system/dataScope'
import DataScopeEdit from './DataScopeEdit'
import DeptScopeModal from './DeptScopeModal'
import UserScopeModal from './UserScopeModal'

export default {
  name: 'DataScopeList',
  mixins: [TableMixin],
  components: {
    DataScopeEdit,
    DeptScopeModal,
    UserScopeModal
  },
  data () {
    return {
      tableData: [],
      queryParam: {
        code: '',
        name: ''
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.tableData = res.data.records
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    remove (record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    add () {
      this.$refs.dataScopeEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.dataScopeEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dataScopeEdit.init(record.id, 'show')
    },
    // 用户范围
    handleUserScope (record) {
      this.$refs.userScopeModal.init(record.id)
    },
    // 部门范围
    handleDeptScope (record) {
      this.$refs.deptScopeModal.init(record.id)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
