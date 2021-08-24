<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="queryParam.username" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.name" placeholder=""/>
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
        <a-button type="primary" icon="plus" @click="$refs.roleAddOrUpdate.edit('','add')">新建</a-button>
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
      <vxe-table-column field="name" title="姓名" />
      <vxe-table-column field="username" title="账号" />
      <vxe-table-column field="phone" title="手机号" />
      <vxe-table-column field="email" title="邮箱" />
      <vxe-table-column admin="admin" title="是否管理员">
        <template slot-scope="{row}">
          {{ row.admin?'是':'否' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="registerTime" title="注册时间" />
      <vxe-table-column fixed="right" width="150" :showOverflow="false" title="操作">
        <template slot-scope="{row}">
          <span>
            <a @click="editRoles(row)">角色分配</a>
          </span>
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
    <!-- 角色配置 -->
    <user-role-edit
      ref="userRoleEdit"
    />
  </a-card>
</template>

<script>
import { del, page } from '@/api/system/user'
import UserRoleEdit from './UserRoleEdit'

export default {
  name: 'UserList',
  components: {
    UserRoleEdit
  },
  data () {
    return {
      loading: false,
      tableData: [],
      pagination: {
        size: 10,
        current: 1,
        total: 0
      },
      pages: {
        size: 10,
        current: 1
      },
      queryParam: {
        account: '',
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
    // 角色配置
    editRoles (record) {
      this.$refs.userRoleEdit.edit(record, 'edit')
    },
    edit (record) {
      this.$refs.pathAddOrUpdate.edit(record.id, 'edit')
    },
    remove (record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    show (record) {
      this.$refs.pathAddOrUpdate.edit(record.id, 'show')
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
