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
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="规格名称"/>
      <vxe-table-column field="type" title="类型">
        <template v-slot="{row}">
          {{ dictConvert('GoodsParamType', row.type) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="options" title="规格选项值"/>
      <vxe-table-column field="remark" title="描述"/>
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
    <specification-edit
      ref="specificationEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
  import { page, del } from '@/api/goods/specification'
  import SpecificationEdit from './SpecificationEdit'
  import { TableMixin } from '@/mixins/TableMixin'
  export default {
    name: 'SpecificationList',
    components: {
      SpecificationEdit
    },
    mixins: [TableMixin],
    data () {
      return {
        queryParam: {
        },
        fields: [
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
        this.$refs.specificationEdit.init('', 'add')
      },
      edit (record) {
        this.$refs.specificationEdit.init(record.id, 'edit')
      },
      show (record) {
        this.$refs.specificationEdit.init(record.id, 'show')
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
