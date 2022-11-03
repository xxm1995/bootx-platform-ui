<template>
  <a-drawer
    :visible="visible"
    title="字典列表"
    :maskClosable="true"
    :width="1000"
    placement="right"
    :closable="true"
    @close="handleCancel"
  >
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: queryPage}"
    >
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60"/>
      <vxe-column field="code" title="字典项编码" />
      <vxe-column field="name" title="字典项名称" />
      <vxe-column field="sortNo" title="字典项排序" />
      <vxe-column field="remark" title="描述" />
      <vxe-column title="操作" fixed="right" width="220" :showOverflow="false">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除字典项"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
    </vxe-pager>
    <dict-item-edit
      ref="dictItemEdit"
      @ok="queryPage"
    />
  </a-drawer>
</template>

<script>
import { itemDel, itemPage } from '@/api/system/dict'
import DictItemEdit from './DictItemEdit'
import { TableMixin } from '@/mixins/TableMixin'
export default {
  name: 'DictItemList',
  components: {
    DictItemEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      visible: false,
      dict: ''
    }
  },
  methods: {
    // 展示列表
    list (dict) {
      this.dict = dict
      this.init()
    },
    init () {
      this.visible = true
      this.queryPage()
    },
    queryPage () {
      this.loading = true
      itemPage({
        dictId: this.dict.id,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    add () {
      this.$refs.dictItemEdit.init(this.dict, 'add')
    },
    edit (record) {
      this.$refs.dictItemEdit.init(record, 'edit')
    },
    show (record) {
      this.$refs.dictItemEdit.init(record, 'show')
    },
    remove (record) {
      itemDel(record.id).then(() => {
        this.$message.info('删除成功')
        this.queryPage()
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
