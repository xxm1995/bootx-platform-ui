<template>
  <a-card :bordered="false">
    <b-query
      :query-param="queryParam"
      :default-item-md="8"
      :disabled-query="superQueryFlag"
      :fields="fields"
      @query="query"
      @reset="resetQuery"/>
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
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="code" title="编码" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="data" title="内容" />
      <vxe-table-column field="type" title="模板类型">
        <template v-slot="{row}">
          {{ dictConvert(MessageTemplateCode, row.type) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="160" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:" @click="render(row)">测试</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否删除模板"
                    @confirm="remove(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:" style="color: red">删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </vxe-table-column>
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
    <template-edit ref="templateEdit" @ok="handleOk"/>
    <template-render ref="templateRender"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import TemplateEdit from './TemplateEdit'
import TemplateRender from './TemplateRender'
import { del, page } from '@/api/notice/messageTemplate'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

export default {
  name: 'TemplateList',
  mixins: [TableMixin],
  components: {
    TemplateEdit,
    TemplateRender
  },
  data () {
    return {
      MessageTemplateCode: 'MessageTemplateCode',
      fields: [
        { field: 'code', type: STRING, name: '编码', placeholder: '请输入编码' },
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' }
      ],
      queryParam: {
        code: '',
        name: ''
      }
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
      this.$refs.templateEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.templateEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.templateEdit.init(record.id, 'show')
    },
    render (record) {
      this.$refs.templateRender.init(record.id)
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
