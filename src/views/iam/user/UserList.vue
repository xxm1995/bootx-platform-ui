<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="账号">
              <a-input v-model="queryParam.account" placeholder=""/>
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
    <div class="table-operator">
      <!--      <a-button type="primary" icon="plus" @click="$refs.pathAddOrUpdate.edit('','add')">新建</a-button>-->
    </div>
    <a-table
      bordered
      :columns="columns"
      :dataSource="tableData"
      :loading="loading"
      :pagination="pagination"
      :rowKey="record => record.id"
      :scroll="{ x: 1500 }"
      @change="handleTableChange"
    >
    </a-table>
    <!-- 角色配置 -->
    <user-role-edit
      ref="userRoleEdit"
    />
  </a-card>
</template>

<script>
import { del, page } from '@/api/iam/user'
import UserRoleEdit from './UserRoleEdit'

export default {
  name: 'UserList',
  components: {
    UserRoleEdit
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
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '账号',
          dataIndex: 'account'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '是否管理员',
          dataIndex: 'admin',
          align: 'center',
          customRender: text => {
            return text ? '是' : '否'
            // return (
            //   <a-switch checked={text} />
            // )
          }
        },
        {
          title: '注册时间',
          dataIndex: 'registerTime',
          align: 'center'
        },
        {
          title: '操作',
          width: '20%',
          align: 'center',
          customRender: (text, record, index) => {
            return (
              <div>
                <a onClick={(e) => this.editRoles(record)}>角色分配</a>
              </div>
              // <div>
              //   <a onClick={(e) => this.edit(record)}
              //   >修改</a>
              //   <a-divider type='vertical' />
              //   <a href='javascript:'
              //      onClick={(e) => this.show(record)}
              //   >查看</a>
              //   <a-divider type='vertical' />
              //   <a-popconfirm title='是否删除权限' onConfirm={(e) => this.delete(record)} okText='是' cancelText='否'>
              //     <a-icon slot='icon' type='question-circle-o' style='color: red' />
              //     <a href='javascript:' style='color: red'>删除</a>
              //   </a-popconfirm>
              // </div>
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
    // 角色配置
    editRoles (record) {
      this.$refs.userRoleEdit.edit(record, 'edit')
    },
    edit (record) {
      this.$refs.pathAddOrUpdate.edit(record.id, 'edit')
    },
    delete (record) {
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
