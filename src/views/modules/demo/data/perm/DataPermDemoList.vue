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
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="creatorName" title="创建人" v-if="$auth('123')"123/>
      <vxe-column field="remark" title="备注" />
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
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <data-perm-demo-edit
      ref="dataPermDemoEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, page } from '@/api/demo/dataPermDemo'
import DataPermDemoEdit from './DataPermDemoEdit'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

export default {
  name: 'DataPermDemoList',
  mixins: [TableMixin],
  components: {
    DataPermDemoEdit
  },
  data () {
    return {
      queryParam: {
        name: '',
        creatorName: '',
        remark: ''
      },
      fields: [
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' },
        { field: 'creatorName', type: STRING, name: '创建人', placeholder: '请输入创建人' },
        { field: 'remark', type: STRING, name: '备注', placeholder: '请输入备注' }
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
      this.$refs.dataPermDemoEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.dataPermDemoEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dataPermDemoEdit.init(record.id, 'show')
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
