<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="权限标识">
              <a-input v-model="queryParam.code" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="请求路径">
              <a-input v-model="queryParam.path" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="请求方式">
              <a-select
                allowClear
                v-model="queryParam.method">
                <a-select-option v-for="v in methodList" :key="v" :value="v">{{ v }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="服务名称">
              <a-input v-model="queryParam.serviceName" placeholder=""/>
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
      <a-button type="primary" icon="plus" @click="$refs.pathAddOrUpdate.edit('','add')">新建</a-button>
    </div>
    <a-table
      bordered
      :columns="columns"
      :dataSource="tableData"
      :loading="loading"
      :pagination="pagination"
      :rowKey="record => record.id"
      @change="handleTableChange"
      :scroll="{ x: 1500 }"
    >
    </a-table>
    <path-add-or-update
      ref="pathAddOrUpdate"
      @ok="handleOk"
    />
    <path-role-edit
      ref="pathRoleEdit"
    />
  </a-card>
</template>

<script>
import { del, page } from '@/api/system/path'
import PathAddOrUpdate from './PathAddOrUpdate'
import PathRoleEdit from './PathRoleEdit'
export default {
  name: 'PathList',
  components: {
    PathAddOrUpdate,
    PathRoleEdit
  },
  data () {
    return {
      loading: false,
      methodList: [
        'get',
        'post',
        'put',
        'delete'
      ],
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
          title: '权限标识',
          dataIndex: 'code'
        },
        {
          title: '请求路径',
          dataIndex: 'path'
        },
        {
          title: '请求方式',
          dataIndex: 'method'
        },
        {
          title: '服务名称',
          dataIndex: 'serviceName'
        },
        {
          title: '公开接口',
          dataIndex: 'publicAccess',
          customRender: text => {
            return text ? '是' : '否'
          }
        },
        {
          title: '需要登录',
          dataIndex: 'loginAccess',
          customRender: text => {
            return text ? '是' : '否'
          }
        },
        {
          title: '内部接口',
          dataIndex: 'within',
          customRender: text => {
            return text ? '是' : '否'
          }
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          align: 'center'
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          customRender: (text, record, index) => {
            return (
              <div>
                <a href='javascript:'onClick={(e) => this.show(record)}>查看</a>
                <a-divider type='vertical' />
                <a-dropdown>
                  <a class="ant-dropdown-link" >
                    更多操作 <a-icon type="down" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:;" onClick={(e) => this.editRoles(record)}>分配角色</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a href="javascript:;" onClick={(e) => this.edit(record)}>修改</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm title='是否删除权限' onConfirm={(e) => this.delete(record)} okText='是' cancelText='否'>
                        <a-icon slot='icon' type='question-circle-o' style='color: red' />
                        <a href='javascript:' style='color: red'>删除</a>
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
        path: '',
        method: '',
        serviceName: ''
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
        this.pagination.total = res.data.total
        // 当前页取决于后端
        this.pagination.current = Number(res.data.current)
        this.pagination.total = res.data.total
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
      this.$refs.pathAddOrUpdate.edit(record.id, 'edit')
    },
    // 角色配置
    editRoles (record) {
      this.$refs.pathRoleEdit.edit(record, 'edit')
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
