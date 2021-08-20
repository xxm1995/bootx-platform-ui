<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色代码">
              <a-input v-model="queryParam.code" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称">
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
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.roleAddOrUpdate.edit('','add')">新建</a-button>
    </div>
    <a-table
      bordered
      :columns="columns"
      :dataSource="tableData"
      :loading="loading"
      :pagination="pagination"
      :rowKey="record => record.id"
      @change="handleTableChange"
    >
    </a-table>
    <role-add-or-update
      ref="roleAddOrUpdate"
      @ok="handleOk"
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
  data () {
    return {
      loading: false,
      columns: [
        {
          title: '序号',
          width: '80px',
          customRender: (text, record, index) => {
            return (
              <div>
                {index + 1}
              </div>
            )
          }
        },
        {
          title: '角色代码',
          dataIndex: 'code'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '角色描述',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          width: '170px',
          fixed: 'right',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <div>
                <a href="javascript:"
                   onClick={(e) => this.show(record)}
                >查看</a>
                <a-divider type="vertical" />
                <a-dropdown>
                  <a className='ant-dropdown-link'>
                    更多操作 <a-icon type='down' />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a onClick={(e) => this.edit(record)}>修改</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:" onClick={(e) => this.perms(record)}>权限分配</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm title="是否删除角色" onConfirm={(e) => this.delete(record)} okText="是" cancelText="否">
                        <a-icon slot="icon" type="question-circle-o" style="color: red" />
                        <a href="javascript:" style="color: red">删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            )
          }
        }
      ],
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
        // 当前页取决于后端
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
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.pages.size = pagination.pageSize
      this.pages.current = pagination.current
      this.init()
    },
    edit (record) {
      this.$refs.roleAddOrUpdate.edit(record.id, 'edit')
    },
    delete (record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    show (record) {
      this.$refs.roleAddOrUpdate.edit(record.id, 'show')
    },
    handleOk () {
      this.init()
    },
    perms (record) {
      this.$refs.rolePermModal.init(record)
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
