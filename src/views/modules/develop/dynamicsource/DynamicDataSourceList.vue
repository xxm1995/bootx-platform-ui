<template>
  <a-card :bordered="false">
    <b-query
      v-model="queryParam"
      :fields="fields"
      :default-item-md="8"
      @query="query"
      @reset="() => queryParam = {}"
    />
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
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="code" title="数据源编码"/>
      <vxe-table-column field="name" title="数据源名称"/>
      <vxe-table-column field="databaseType" title="数据库类型"/>
      <vxe-table-column field="dbDriver" title="驱动类"/>
      <vxe-table-column field="dbUrl" title="数据库地址"/>
      <vxe-table-column field="dbName" title="数据库名称"/>
      <vxe-table-column field="dbUsername" title="用户名"/>
      <vxe-table-column field="dbPassword" title="密码"/>
      <vxe-table-column field="remark" title="备注"/>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="150" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-table-column>
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
  </a-card>
</template>

<script>
  import { page, del } from '@/api/develop/dynamicDataSource'
  import DynamicDataSourceEdit from './DynamicDataSourceEdit'
  import { TableMixin } from '@/mixins/TableMixin'
  import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
  export default {
    name: 'DynamicDataSourceList',
    components: {
      DynamicDataSourceEdit
    },
    mixins: [TableMixin],
    data () {
      return {
        fields: [
          { field: 'code', type: STRING, name: '编码', placeholder: '请输入数据源编码' },
          { field: 'name', type: STRING, name: '名称', placeholder: '请输入数据源名称' }
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
