<template>
  <a-card :bordered="false">
    <b-query
      v-model="queryParam"
      :fields="fields"
      :default-item-md="8"
      @query="query"
      @reset="() => queryParam = {}"/>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
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
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="code" title="角色代码" />
      <vxe-column field="name" title="角色名称" />
      <vxe-column field="remark" title="备注" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="210" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除角色"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              授权 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:" @click="handleRoleMenu(row)">菜单授权</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:" @click="handleRolePath(row)">请求授权</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </vxe-column>
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

    <role-edit
      ref="roleEdit"
      @ok="handleOk"
    />
    <role-menu-modal
      ref="roleMenuModal"
    />
    <role-path-modal
      ref="rolePathModal"
    />
  </a-card>
</template>

<script>
import RoleEdit from './RoleEdit'
import RoleMenuModal from './RoleMenuModal'
import RolePathModal from './RolePathModal'
import { del, page } from '@/api/system/role'
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'RoleList',
  components: {
    RoleEdit,
    RoleMenuModal,
    RolePathModal
  },
  mixins: [TableMixin],
  data () {
    return {
      tableData: [],
      queryParam: {
        code: '',
        name: ''
      },
      fields: [
        { field: 'code', type: STRING, name: '角色编号', placeholder: '请输入角色编码' },
        { field: 'name', type: STRING, name: '角色名称', placeholder: '请输入角色名称' }
      ]
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
    remove (record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    add () {
      this.$refs.roleEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.roleEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.roleEdit.init(record.id, 'show')
    },
    // 菜单授权处理
    handleRoleMenu (record) {
      this.$refs.roleMenuModal.init(record.id)
    },
    // 请求授权处理
    handleRolePath (record) {
      this.$refs.rolePathModal.init(record.id)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
