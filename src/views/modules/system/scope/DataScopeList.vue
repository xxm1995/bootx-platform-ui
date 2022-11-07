<template>
  <a-card :bordered="false">
    <b-query
      v-model="queryParam"
      :fields="fields"
      :default-item-md="6"
      @query="query"
      @reset="() => queryParam = {}"
    />
    <vxe-toolbar
      custom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData">
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="code" title="编码" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="type" title="类型">
        <template v-slot="{row}">
          {{ dictConvert('DataScopePerm',row.type) }}
        </template>
      </vxe-column>
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
              <template #overlay>
                <a-menu>
                  <a-menu-item :disabled="![2,4].includes(row.type)">
                    <a :disabled="![2,4].includes(row.type)" href="javascript:" @click="handleUserScope(row)">关联用户</a>
                  </a-menu-item>
                  <a-menu-item :disabled="![3,4].includes(row.type)">
                    <a href="javascript:" :disabled="![3,4].includes(row.type)" @click="handleDeptScope(row)">关联部门</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </vxe-column>
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
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

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
      },
      fields: [
        { field: 'code', type: STRING, name: '编码', placeholder: '请输入权限编码' },
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入权限名称' }
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
