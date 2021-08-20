<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.permissionAddOrUpdate.edit('','add',false)">新建</a-button>
    </div>
    <a-table
      bordered
      :columns="columns"
      :dataSource="tableData"
      :loading="loading"
      :rowKey="record => record.id"
      :pagination="false"
    >
      <span slot="type" slot-scope="text">
        <span v-show="String(text) === '0'">目录</span>
        <span v-show="String(text) === '1'">菜单</span>
        <span v-show="String(text) === '2'">按钮</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <a href="javascript:" @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm title="是否删除角色" @confirm="deleteItem(record)" okText="是" cancelText="否">
          <a-icon slot="icon" type="question-circle-o" style="color: red" />
          <a href="javascript:" style="color: red">删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a href="javascript:" @click="$refs.permissionAddOrUpdate.edit(record,'add',true)">添加下级菜单</a>
      </span>
    </a-table>
    <permission-add-or-update
      ref="permissionAddOrUpdate"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { list, delObj } from '@/api/iam/menu'
import permissionAddOrUpdate from './MenuAddOrUpdate'
export default {
  name: 'MenuList',
  components: {
    permissionAddOrUpdate
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
          title: '权限名称',
          dataIndex: 'name'
        },
        {
          title: '权限标示',
          dataIndex: 'perms'
        },
        {
          title: '类型',
          dataIndex: 'menuType',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '操作',
          width: '25%',
          scopedSlots: { customRender: 'action' }
        }
      ],
      tableData: []
    }
  },
  methods: {
    init () {
      this.loading = true
      list().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    edit (record) {
      this.$refs.permissionAddOrUpdate.edit(record, 'edit')
    },
    deleteItem (record) {
      delObj(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      }).catch(err => {
        this.$message.error(err.msg)
      })
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
