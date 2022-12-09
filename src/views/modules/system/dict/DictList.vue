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
        <a-button type="primary" icon="plus" @click="$refs.dictEdit.init('','add')">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60"/>
      <vxe-column field="code" title="编码" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="groupTag" title="分类标签">
        <template v-slot="{row}">
          <a-tag color="green">{{ row.groupTag||'空' }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="enable" title="启用状态">
        <template v-slot="{row}">
          <a-tag v-if="row.enable" color="green">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="remark" title="描述" />
      <vxe-column title="操作" fixed="right" width="220">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="itemList(row)">字典配置</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除字典"
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
      @page-change="handleTableChange">
    </vxe-pager>
    <dict-edit
      ref="dictEdit"
      @ok="handleOk"
    />
    <dict-item-list
      ref="dictItemList"
    />
  </a-card>
</template>

<script>
import { page, del } from '@/api/system/dict'
import DictEdit from './DictEdit'
import DictItemList from './DictItemList'
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'DictList',
  components: {
    DictEdit,
    DictItemList
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        code: '',
        name: '',
        groupTag: ''
      },
      fields: [
        { field: 'code', type: STRING, name: '字典编码', placeholder: '请输入字典编码' },
        { field: 'name', type: STRING, name: '字典名称', placeholder: '请输入字典名称' },
        { field: 'groupTag', type: STRING, name: '分组标签', placeholder: '请输入分组标签' }
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
    edit (record) {
      this.$refs.dictEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dictEdit.init(record.id, 'show')
    },
    itemList (record) {
      this.$refs.dictItemList.list(record)
    },
    remove (record) {
      del(record.id).then(() => {
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
