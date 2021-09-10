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
            <a-button type="primary" @click="query">查询</a-button>
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
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
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
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="姓名" />
      <vxe-table-column field="username" title="账号" />
      <vxe-table-column field="phone" title="手机号" />
      <vxe-table-column field="email" title="邮箱" />
      <vxe-table-column field="admin" title="是否管理员">
        <template slot-scope="{row}">
          <a-tag v-if="row.admin" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="用户状态">
        <template slot-scope="{row}">
          <a-tag>{{ dictConvert(userStatusCode,row.status) }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="registerTime" title="注册时间" />
      <vxe-table-column fixed="right" width="170" :showOverflow="false" title="操作">
        <template slot-scope="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="assignRoles(row)">角色分配</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="resetPwd(row)">重置密码</a>
              </a-menu-item>
              <a-menu-item>
                <a href="javascript:">锁定账号</a>
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
    <!-- 角色配置 -->
    <user-role-assign
      ref="userRoleAssign"
    />
    <!--  添加用户  -->
    <user-add
      @ok="init"
      ref="userAdd"
    />
    <!--  编辑用户  -->
    <user-edit
      @ok="init"
      ref="userEdit"
    />
    <!--  查看用户  -->
    <user-show
      @ok="init"
      ref="userShow"
    />
    <!--  重置密码  -->
    <user-reset-password
      ref="resetPassword"
    />
  </a-card>
</template>

<script>
import { del, page } from '@/api/system/user'
import UserRoleAssign from './UserRoleAssign'
import UserAdd from './UserAdd'
import UserEdit from './UserEdit'
import UserShow from './UserShow'
import UserResetPassword from './UserResetPassword'
import { TableMixin } from '@/mixins/TableMixin'

export default {
  name: 'UserList',
  components: {
    UserRoleAssign,
    UserAdd,
    UserEdit,
    UserShow,
    UserResetPassword
  },
  mixins: [TableMixin],
  data () {
    return {
      userStatusCode: 'UserStatusCode',
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
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    // 分配角色
    assignRoles (record) {
      this.$refs.userRoleAssign.edit(record, 'edit')
    },
    add () {
      this.$refs.userAdd.init('', 'add')
    },
    show (record) {
      this.$refs.userShow.init(record.id, 'show')
    },
    edit (record) {
      this.$refs.userEdit.init(record.id, 'edit')
    },
    resetPwd (record) {
      this.$refs.resetPassword.init(record.id, 'edit')
    },
    remove (record) {
      del(record.id).then(res => {
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
