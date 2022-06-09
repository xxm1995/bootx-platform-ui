<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="queryParam.username" placeholder="请输入要查询的账号"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.name" placeholder="请输入要查询的姓名"/>
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
        <a-space>
          <a-button type="primary" icon="plus" @click="add">新建</a-button>
          <a-dropdown v-show="batchOperateFlag">
            <a-button > 批量操作 <a-icon type="down" /></a-button>
            <template v-slot:overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="assignRolesBatch()">角色分配</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="assignDeptBatch()">部门分配</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="assignDataScopeBatch()">数据权限分配</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="lockUserConfirmBatch(true)">锁定账号</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="lockUserConfirmBatch(false)">解锁账号</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      show-overflow
      row-id="id"
      ref="table"
      size="medium"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
      :loading="loading"
      :data="tableData">
      <vxe-column type="checkbox" width="40"/>
      <vxe-table-column field="name" title="姓名" />
      <vxe-table-column field="username" title="账号" />
      <vxe-table-column field="phone" title="手机号" />
      <vxe-table-column field="email" title="邮箱" />
      <vxe-table-column field="admin" title="是否管理员">
        <template v-slot="{row}">
          <a-tag v-if="row.admin" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="用户状态">
        <template v-slot="{row}">
          {{ dictConvert(userStatusCode,row.status) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="registerTime" title="注册时间" />
      <vxe-table-column fixed="right" width="170" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template v-slot:overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="assignRoles(row)">角色分配</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="assignDept(row)">部门分配</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="assignDataScope(row)">数据权限分配</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="resetPwd(row)">重置密码</a>
                </a-menu-item>
                <a-menu-item>
                  <a v-if="row.status === 1 " @click="lockUserConfirm(row.id,true)">锁定账号</a>
                  <a v-if="row.status === 3 " @click="lockUserConfirm(row.id,false)">解锁账号</a>
                </a-menu-item>
              </a-menu>
            </template>
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
      @page-change="handleTableChange">
    </vxe-pager>
    <!-- 角色分配 -->
    <user-role-assign ref="userRoleAssign" />
    <user-role-assign-batch ref="userRoleAssignBatch" />
    <!-- 角色分配 -->
    <user-data-scope-assign ref="userDataScopeAssign" />
    <user-data-scope-assign-batch ref="userDataScopeAssignBatch"/>
    <!-- 部门分配 -->
    <user-dept-assign ref="userDeptAssign" />
    <user-dept-assign-batch ref="userDeptAssignBatch" />
    <!--  添加用户  -->
    <user-add @ok="init" ref="userAdd" />
    <!--  编辑用户  -->
    <user-edit @ok="init" ref="userEdit" />
    <!--  查看用户详情  -->
    <user-show @ok="init" ref="userShow"/>
    <!--  重置密码  -->
    <user-reset-password ref="resetPassword" />
  </a-card>
</template>

<script>
import { del, lockUser, lockUserBatch, page, unlockUser, unlockUserBatch } from '@/api/system/user'
import UserRoleAssign from './role/UserRoleAssign'
import UserRoleAssignBatch from './role/UserRoleAssignBatch'
import UserDeptAssign from './dept/UserDeptAssign'
import UserDeptAssignBatch from './dept/UserDeptAssignBatch'
import UserDataScopeAssign from './scope/UserDataScopeAssign'
import UserDataScopeAssignBatch from './scope/UserDataScopeAssignBatch'
import UserAdd from './UserAdd'
import UserEdit from './UserEdit'
import UserShow from './UserShow'
import UserResetPassword from './UserResetPassword'
import { TableMixin } from '@/mixins/TableMixin'

export default {
  name: 'UserList',
  components: {
    UserRoleAssign,
    UserRoleAssignBatch,
    UserDeptAssign,
    UserDeptAssignBatch,
    UserDataScopeAssign,
    UserDataScopeAssignBatch,
    UserAdd,
    UserEdit,
    UserShow,
    UserResetPassword
  },
  mixins: [TableMixin],
  data () {
    return {
      // 用户状态编码
      userStatusCode: 'UserStatusCode',
      // 终端列表
      clientList: [],
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
        this.pageQueryResHandel(res, this)
      })
    },
    // 分配角色
    assignRoles (record) {
      this.$refs.userRoleAssign.edit(record)
    },
    // 批量分配角色
    assignRolesBatch () {
      const userIds = this.$refs.table.getCheckboxRecords().map(o => o.id)
      this.$refs.userRoleAssignBatch.edit(userIds)
    },
    // 分配数据权限
    assignDataScope (record) {
      this.$refs.userDataScopeAssign.edit(record)
    },
    // 批量分配数据权限
    assignDataScopeBatch () {
      const userIds = this.$refs.table.getCheckboxRecords().map(o => o.id)
      this.$refs.userDataScopeAssignBatch.edit(userIds)
    },
    // 分配部门
    assignDept (record) {
      this.$refs.userDeptAssign.init(record.id)
    },
    // 批量分配数据部门
    assignDeptBatch () {
      const userIds = this.$refs.table.getCheckboxRecords().map(o => o.id)
      this.$refs.userDeptAssignBatch.init(userIds)
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
    /**
     * 锁定/解锁用户
     * @param userId 用户id
     * @param type true 锁定, false 解锁
     */
    lockUserConfirm (userId, type) {
      const that = this
      this.$confirm({
        title: type ? '是否锁定选中的用户' : '是否解锁选中的用户',
        onOk: async function () {
          if (type) {
            await lockUser(userId)
          } else {
            await unlockUser(userId)
          }
          that.init()
        }
      })
    },
    /**
     * 批量锁定/解锁用户
     * @param type true 锁定, false 解锁
     */
    lockUserConfirmBatch (type) {
      const userIds = this.$refs.table.getCheckboxRecords().map(o => o.id)
      const that = this
      this.$confirm({
        title: type ? '是否锁定选中的用户' : '是否解锁选中的用户',
        onOk: async function () {
          if (type) {
            await lockUserBatch(userIds)
          } else {
            await unlockUserBatch(userIds)
          }
          that.init()
        }
      })
    },
    // 选中全部
    selectAllEvent () {
      const records = this.$refs.table.getCheckboxRecords()
      this.batchOperateFlag = !!records.length
    },
    // 选中事件
    selectChangeEvent () {
      const records = this.$refs.table.getCheckboxRecords()
      this.batchOperateFlag = !!records.length
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
    // 创建监听
    this.$bus.on('cs', data => {
      console.log('事件总线接收消息', data)
    })
  },
  destroyed () {
    // 解除监听
    this.$bus.off('cs')
  }
}
</script>

<style scoped>

</style>
