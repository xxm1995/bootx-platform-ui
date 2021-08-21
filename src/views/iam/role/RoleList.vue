<template>
  <a-card :bordered='false'>
    <div class='table-page-search-wrapper'>
      <a-form layout='inline'>
        <a-row :gutter='48'>
          <a-col :md='8' :sm='24'>
            <a-form-item label='角色代码'>
              <a-input v-model='queryParam.code' placeholder='' />
            </a-form-item>
          </a-col>
          <a-col :md='8' :sm='24'>
            <a-form-item label='角色名称'>
              <a-input v-model='queryParam.name' placeholder='' />
            </a-form-item>
          </a-col>
          <a-col :md='8' :sm='24'>
            <a-button type='primary' @click='() => {this.resetPage();this.init()}'>查询</a-button>
            <a-button style='margin-left: 8px' @click='() => queryParam = {}'>重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class='table-operator'>
        <vxe-toolbar
          custom
          zoom
          :refresh="{query: init}"
        >
          <template v-slot:buttons>
            <a-button type='primary' icon='plus' @click="$refs.roleAddOrUpdate.edit('','add')">新建</a-button>
          </template>
        </vxe-toolbar>
    </div>

    <vxe-table
      border
      stripe
      show-overflow
      row-id='id'
      size='medium'
      :loading='loading'
      :data='tableData'>
      <!--      <vxe-table-column type='checkbox' width='60' />-->
      <vxe-table-column type='seq' title='序号' width='60' />
      <vxe-table-column field='code' title='角色代码' />
      <vxe-table-column field='name' title='角色名称' />
      <vxe-table-column field='description' title='角色描述' />
      <vxe-table-column field='createTime' title='创建时间' />
      <vxe-table-column field='createTime' fixed="right" width='150' :showOverflow='false' title='操作'>
        <template slot-scope='{row}'>
          <span>
            <a href='#' @click='show(row)'>查看</a>
          </span>
          <a-divider type='vertical'/>
          <a-dropdown>
            <a class="ant-dropdown-link"
               @click="e => e.preventDefault()">
              更多操作 <a-icon type="down" />
            </a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a href='#' @click='edit(row)'>编辑</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm
                  title='是否删除角色'
                  @confirm="remove(row)"
                  okText='是'
                  cancelText='否'>
                  <a href="#" style='color: red'>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </template>
      </vxe-table-column>
    </vxe-table>

    <vxe-pager
      border
      size='medium'
      :loading='loading'
      :current-page='pagination.pageSize'
      :page-size='pagination.size'
      :total='pagination.total'
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change='handlePageChange'>
    </vxe-pager>

    <role-add-or-update
      ref='roleAddOrUpdate'
      @ok='handleOk'
    />
    <!--    <role-perm-modal-->
    <!--      ref="rolePermModal"-->
    <!--    />-->
  </a-card>
</template>

<script>
import RoleAddOrUpdate from './RoleAddOrUpdate'
import { del, page } from '@/api/iam/role'

export default {
  name: 'RoleList',
  components: {
    RoleAddOrUpdate
  },
  data() {
    return {
      loading: false,
      tableData: [],
      pagination: {
        pageSize: 10,
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
      loading3: false,
      tableData3: [],
      tablePage3: {
        currentPage: 1,
        pageSize: 10,
        totalResult: 0
      }
    }
  },
  methods: {
    init() {
      this.findList3()
      this.loading = true
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.tableData = res.data.records
        this.pagination.total = +res.data.total
        // 当前页取决于后端
        this.pagination.current = Number(res.data.current)
        this.loading = false
      })
    },
    confirm(e) {
      console.log(e);
      this.$message.success('Click on Yes');
    },
    cancel(e) {
      console.log(e);
      this.$message.error('Click on No');
    },
    // 重置当前页数
    resetPage() {
      this.pages = {
        size: 10,
        current: 1,
        pages: 0
      }
    },
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.pages.size = pagination.pageSize
      this.pages.current = pagination.current
      this.init()
    },
    edit(record) {
      console.log(666)
      this.$refs.roleAddOrUpdate.edit(record.id, 'edit')
    },
    remove(record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    show(record) {
      this.$refs.roleAddOrUpdate.edit(record.id, 'show')
    },
    handleOk() {
      this.init()
    },
    perms(record) {
      this.$refs.rolePermModal.init(record)
    },

    findList3() {
      this.loading3 = true
      setTimeout(() => {
        const list = [
          { id: 10001, name: 'Test1', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'Shenzhen' },
          { id: 10002, name: 'Test2', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou' },
          { id: 10003, name: 'Test3', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai' },
          { id: 10004, name: 'Test4', nickname: 'T4', role: 'Designer', sex: '0', age: 23, address: 'Shenzhen' },
          { id: 10005, name: 'Test5', nickname: 'T5', role: 'Develop', sex: '0', age: 30, address: 'Shanghai' },
          { id: 10006, name: 'Test6', nickname: 'T6', role: 'Develop', sex: '0', age: 27, address: 'Shanghai' },
          { id: 10007, name: 'Test7', nickname: 'T1', role: 'Develop', sex: '1', age: 28, address: 'Shenzhen' },
          { id: 10008, name: 'Test8', nickname: 'T2', role: 'Test', sex: '0', age: 22, address: 'Guangzhou' },
          { id: 10009, name: 'Test9', nickname: 'T3', role: 'PM', sex: '1', age: 32, address: 'Shanghai' },
          { id: 100010, name: 'Test10', nickname: 'T4', role: 'Designer', sex: '0', age: 23, address: 'Shenzhen' },
          { id: 100011, name: 'Test11', nickname: 'T5', role: 'PM', sex: '0', age: 35, address: 'Shenzhen' },
          { id: 100012, name: 'Test12', nickname: 'T6', role: 'Designer', sex: '1', age: 25, address: 'Shanghai' },
          { id: 100013, name: 'Test13', nickname: 'T9', role: 'Develop', sex: '1', age: 33, address: 'Shenzhen' },
          { id: 100014, name: 'Test14', nickname: 'T6', role: 'Develop', sex: '0', age: 21, address: 'Shanghai' },
          { id: 100015, name: 'Test15', nickname: 'T6', role: 'Develop', sex: '0', age: 19, address: 'Shanghai' },
          { id: 100016, name: 'Test16', nickname: 'T8', role: 'Develop', sex: '1', age: 29, address: 'Shenzhen' }
        ]
        this.loading3 = false
        this.tablePage3.totalResult = list.length
        this.tableData3 = list.slice((this.tablePage3.currentPage - 1) * this.tablePage3.pageSize, this.tablePage3.currentPage * this.tablePage3.pageSize)
      }, 300)
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage3.currentPage = currentPage
      this.tablePage3.pageSize = pageSize
      this.init()
    }
  },
  created() {
    this.init()
  }
}
</script>

<style scoped>

</style>
