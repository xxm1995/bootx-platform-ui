<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色代码">
              <a-input v-model="queryParam.code" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
              <a-input v-model="queryParam.name" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="() => {this.resetPage();this.init()}">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
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
        <a-button type="primary" icon="plus" @click="$refs.roleEdit.edit('','add')">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData">
      <!--      <vxe-table-column type='checkbox' width='60' />-->
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="code" title="角色代码" />
      <vxe-table-column field="name" title="角色名称" />
      <vxe-table-column field="description" title="角色描述" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="150" :showOverflow="false" title="操作">
        <template slot-scope="{row}">
          <span>
            <a href="javascript:" @click="roleInfoShow(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a
              class="ant-dropdown-link"
              @click="e => e.preventDefault()">
              更多操作 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href="javascript:" @click="edit(row)">编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:" @click="handlePermission(row)">授权</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                  title="是否删除角色"
                  @confirm="remove(row)"
                  okText="是"
                  cancelText="否">
                  <a href="javascript:" style="color: red">删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handleTableChange">
    </vxe-pager>

    <role-edit
      ref="roleEdit"
      @ok="handleOk"
    />
    <role-perm-modal
      ref="rolePermModal"
    />
  </a-card>
</template>

<script>
import RoleEdit from './RoleEdit'
import RolePermModal from './RolePermModal'
import { del, page } from '@/api/iam/role'

export default {
  name: 'RoleList',
  components: {
    RoleEdit,
    RolePermModal
  },
  data () {
    return {
      loading: false,
      tableData: [],
      pagination: {
        size: 10,
        current: 1,
        total: 0,
        showSizeChanger: true
      },
      pages: {
        size: 10,
        current: 1
      },
      queryParam: {
        code: '',
        name: ''
      },
      tablePage: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
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
        this.pagination.total = +res.data.total
        this.pagination.current = +res.data.current
        this.pagination.size = +res.data.size
        this.loading = false
      })
    },
    // 重置当前页数
    resetPage () {
      this.pages = {
        size: 10,
        current: 1,
        pages: 0
      }
    },
    handleTableChange ({ currentPage, pageSize }) {
      this.pages.current = currentPage
      this.pages.size = pageSize
      this.init()
    },
    edit (record) {
      this.$refs.roleEdit.edit(record.id, 'edit')
    },
    remove (record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    // 授权处理
    handlePermission (record) {
      this.$refs.rolePermModal.edit(record.id)
    },
    roleInfoShow (record) {
      this.$refs.roleEdit.edit(record.id, 'show')
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
