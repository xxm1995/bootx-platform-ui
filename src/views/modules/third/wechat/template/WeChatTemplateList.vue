<template>
  <a-card :bordered="false">
    <b-query
      :query-param="queryParam"
      :default-item-md="8"
      :disabled-query="superQueryFlag"
      :fields="fields"
      @query="query"
      @reset="() => queryParam = {}"/>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-button @click="sync" icon="sync">同步微信模板</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="名称"/>
      <vxe-column field="code" title="编码"/>
      <vxe-column field="templateId" title="模板ID"/>
      <vxe-column field="title" title="模板标题"/>
      <vxe-column field="primaryIndustry" title="模板所属行业的一级行业"/>
      <vxe-column field="deputyIndustry" title="模板所属行业的二级行业"/>
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="100" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
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
    <we-chat-template-edit
      ref="weChatTemplateEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { page, sync } from '@/api/third/weChatTemplate'
import WeChatTemplateEdit from './WeChatTemplateEdit'
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'WeChatTemplateList',
  components: {
    WeChatTemplateEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        code: '',
        name: '',
        templateId: ''
      },
      fields: [
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' },
        { field: 'code', type: STRING, name: '编码', placeholder: '请输入编码' },
        { field: 'templateId', type: STRING, name: '模板ID', placeholder: '请输入模板ID' }
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
      this.$refs.weChatTemplateEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.weChatTemplateEdit.init(record.id, 'show')
    },
    sync () {
      this.$confirm({
        title: '同步',
        content: '是否同步消息模板',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          sync().then(() => {
            this.$message.info('开始同步微信消息模板')
          })
        }
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
