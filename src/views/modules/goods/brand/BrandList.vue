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
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="品牌名称"/>
      <vxe-column field="logo" title="品牌图标"/>
      <vxe-column field="enable" title="启用状态">
        <template v-slot="{row}">
          {{ row.enable?'启用':'停用' }}
        </template>
      </vxe-column>
      <vxe-column field="remark" title="描述"/>
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
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
      </vxe-column>
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <brand-edit
      ref="brandEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
  import { page, del } from '@/api/goods/brand'
  import BrandEdit from './BrandEdit'
  import { TableMixin } from '@/mixins/TableMixin'
  import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
  export default {
    name: 'BrandList',
    components: {
      BrandEdit
    },
    mixins: [TableMixin],
    data () {
      return {
        queryParam: {
          name: ''
        },
        fields: [
          { field: 'name', type: STRING, name: '品牌名称', placeholder: '请输入品牌名称' }
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
        this.$refs.brandEdit.init('', 'add')
      },
      edit (record) {
        this.$refs.brandEdit.init(record.id, 'edit')
      },
      show (record) {
        this.$refs.brandEdit.init(record.id, 'show')
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
