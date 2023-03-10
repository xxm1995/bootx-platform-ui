<template>
  <a-card :bordered="false">
    <b-query
      v-model="queryParam"
      :fields="fields"
      :default-item-count="3"
      :default-item-md="6"
      @query="query"
      @reset="() => queryParam = {}"
    />
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-space>
          <a-button type="primary" icon="plus" @click="add">新建</a-button>
          <a-button @click="showDatabaseList">数据源列表</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="code" title="编码" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="databaseType" title="数据库类型">
        <template #default="{ row }">
          <a-tag> {{ dictConvert('DatabaseType', row.databaseType) }} </a-tag>
        </template>
      </vxe-column>
      <vxe-column field="dbDriver" title="驱动类" />
      <vxe-column field="dbUrl" title="连接地址" />
      <vxe-column field="dbUsername" title="用户名" />
      <vxe-column field="remark" title="备注" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="160" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:" @click="testConnectionInfo(row)">测试连接</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:" @click="addDynamicDataSource(row)">应用</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:" style="color: red" @click="remove(row)">删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <dynamic-data-source-edit
      ref="dynamicDataSourceEdit"
      @ok="handleOk"/>
    <data-source-list ref="dataSourceList"/>
  </a-card>
</template>

<script>
import {
  page,
  del,
  testConnectionById,
  existsByDataSourceKey,
  addDynamicDataSourceById, databaseTypes
} from '@/api/develop/dynamicDataSource'
import DataSourceList from './DataSourceList'
import DynamicDataSourceEdit from './DynamicDataSourceEdit'
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'DynamicDataSourceList',
  components: {
    DynamicDataSourceEdit,
    DataSourceList
  },
  mixins: [TableMixin],
  data () {
    return {
      fields: [
        { field: 'code', type: STRING, name: '编码', placeholder: '请输入数据源编码' },
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入数据源名称' },
        {
          field: 'databaseType',
          type: 'list',
          name: '数据库类型',
          selectList: databaseTypes,
          placeholder: '请选择数据库类型'
        }
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
    add () {
      this.$refs.dynamicDataSourceEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.dynamicDataSourceEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dynamicDataSourceEdit.init(record.id, 'show')
    },
    // 查看数据源列表
    showDatabaseList () {
      this.$refs.dataSourceList.show()
    },
    // 测试连接
    async testConnectionInfo(record) {
      const { data } = await testConnectionById(record.id)
      if (data) {
        this.$message.warn(data)
      } else {
        this.$message.success('连接成功')
      }
    },
    // 应用到系统中
    async addDynamicDataSource(record) {
      const { data } = await existsByDataSourceKey(record.code)
      if (data) {
        this.$confirm({
          title: '重新添加',
          content: '该数据源配置已经应用，是否进行更新',
          onOk: () => {
            addDynamicDataSourceById(record.id).then(() => {
              this.$message.success('更新成功')
            })
          }
        })
      } else {
        this.$confirm({
          title: '添加',
          content: '是否将该数据源配置应用到系统中',
          onOk: () => {
            addDynamicDataSourceById(record.id).then(() => {
              this.$message.success('应用成功')
            })
          },
        })
      }
    },
    remove (record) {
      del(record.id).then(_ => {
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
