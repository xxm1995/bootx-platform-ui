<template>
  <a-card :bordered="false">
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
      <vxe-table-column field="name" title="参数组名称"/>
      <vxe-table-column field="sortNo" title="排序"/>
      <vxe-table-column field="remark" title="描述"/>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="220" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="parameterList(row)">字典配置</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除字典"
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
    <parameter-group-edit
      ref="parameterGroupEdit"
      @ok="handleOk"/>
    <parameter-list ref="parameterList"/>
  </a-card>
</template>

<script>
  import { page, del } from '@/api/goods/parameterGroup'
  import ParameterGroupEdit from './ParameterGroupEdit'
  import ParameterList from './ParameterList'
  import { TableMixin } from '@/mixins/TableMixin'
  export default {
    name: 'ParameterGroupList',
    components: {
      ParameterGroupEdit,
      ParameterList
    },
    mixins: [TableMixin],
    data () {
      return {
        categoryId: null,
        queryParam: {
        }
      }
    },
    watch: {
      // 监听路由，只要路由有变化(路径，参数等变化)都有执行下面的函数
      $route: {
        handler: () => {
          this.categoryId = this.$route.query.categoryId
          this.init()
        },
        deep: true
      }
    },
    methods: {
      init () {
        console.log(this.categoryId)
        this.loading = true
        page({
          ...this.queryParam,
          ...this.pages,
          categoryId: this.categoryId
        }).then(res => {
          this.pageQueryResHandel(res, this)
        })
      },
      add () {
        this.$refs.parameterGroupEdit.init('', 'add', this.categoryId)
      },
      edit (record) {
        this.$refs.parameterGroupEdit.init(record.id, 'edit')
      },
      show (record) {
        this.$refs.parameterGroupEdit.init(record.id, 'show')
      },
      remove (record) {
        del(record.id).then(_ => {
          this.$message.info('删除成功')
          this.init()
        })
      },
      parameterList (record) {
        this.$refs.parameterList.list(record.id, this.categoryId)
      }
    },
    created () {
      this.categoryId = this.$route.query.categoryId
      this.init()
    }
  }
</script>

<style scoped>

</style>
