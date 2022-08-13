<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" >
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="请输入名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.code" placeholder="请输入编码"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.templateId" placeholder="请输入模板ID"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
              <a-button @click="resetQuery">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-space>
          <a-popconfirm
            title="是否同步同步微信模板"
            @confirm="sync()"
            okText="是"
            cancelText="否">
            <a-button icon="sync">同步微信模板</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称"/>
      <vxe-table-column field="code" title="编码"/>
      <vxe-table-column field="templateId" title="模板ID"/>
      <vxe-table-column field="title" title="模板标题"/>
      <vxe-table-column field="primaryIndustry" title="模板所属行业的一级行业"/>
      <vxe-table-column field="deputyIndustry" title="模板所属行业的二级行业"/>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="100" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
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
    <we-chat-template-edit
      ref="weChatTemplateEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { page, sync } from '@/api/third/weChatTemplate'
import WeChatTemplateEdit from './WeChatTemplateEdit'
import { TableMixin } from '@/mixins/TableMixin'
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
    edit (record) {
      this.$refs.weChatTemplateEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.weChatTemplateEdit.init(record.id, 'show')
    },
    sync(){
      sync().then(()=>{
        this.$message.info('开始同步微信消息模板')
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
