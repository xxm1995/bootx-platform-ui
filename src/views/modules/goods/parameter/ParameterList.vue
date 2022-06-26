<template>
  <a-drawer
    :visible="visible"
    title="参数列表"
    :maskClosable="true"
    :width="1000"
    placement="right"
    :closable="true"
    @close="handleCancel"
  >
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
      <vxe-table-column field="name" title="参数名称"/>
      <vxe-table-column field="type" title="类型">
        <template v-slot="{row}">
          {{ dictConvert('GoodsParamType', row.type) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="options" title="选择值(列表)"/>
      <vxe-table-column field="required" title="是否必填">
        <template v-slot="{row}">
          <a-tag>{{ row.required?'是':'否' }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="sortNo" title="排序" :visible="false"/>
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
    <parameter-edit
      ref="parameterEdit"
      @ok="handleOk"/>
  </a-drawer>
</template>

<script>
  import { page, del } from '@/api/goods/parameter'
  import ParameterEdit from './ParameterEdit'
  import { TableMixin } from '@/mixins/TableMixin'
  export default {
    name: 'ParameterList',
    components: {
      ParameterEdit
    },
    mixins: [TableMixin],
    data () {
      return {
        categoryId: null,
        groupId: null,
        visible: false,
        queryParam: {
        }
      }
    },
    methods: {
      list (id, categoryId) {
        this.categoryId = categoryId
        this.groupId = id
        this.visible = true
        this.init()
      },
      init () {
        this.loading = true
        page({
          ...this.queryParam,
          ...this.pages,
          groupId: this.groupId,
          categoryId: this.categoryId
        }).then(res => {
          this.pageQueryResHandel(res, this)
        })
      },
      add () {
        this.$refs.parameterEdit.init('', 'add', { groupId: this.groupId, categoryId: this.categoryId })
      },
      edit (record) {
        this.$refs.parameterEdit.init(record.id, 'edit')
      },
      show (record) {
        this.$refs.parameterEdit.init(record.id, 'show')
      },
      remove (record) {
        del(record.id).then(_ => {
          this.$message.info('删除成功')
          this.init()
        })
      },
      handleCancel () {
        this.visible = false
      }
    }
  }
</script>

<style scoped>

</style>
