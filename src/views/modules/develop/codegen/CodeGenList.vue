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
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="tableName" title="表名称" />
      <vxe-column field="engine" title="引擎类型" />
      <vxe-column field="tableComment" title="表表述" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <!--          <a href="javascript:" @click="previewShow(row)">预览</a>-->
          <!--          <a-divider type="vertical" />-->
          <a href="javascript:" @click="generateShow(row)">生成</a>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"
    />
    <code-gen-form ref="codeGenForm" @gen="generate" @preview="preview"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { codeGenPreview, genCodeZip, page } from '@/api/develop/codeGen'
import CodeGenForm from './CodeGenForm'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { DownMixin } from '@/mixins/DownMixin'
export default {
  name: 'CodeGenList',
  mixins: [TableMixin, DownMixin],
  components: {
    CodeGenForm
  },
  data () {
    return {
      fields: [
        { field: 'tableName', type: STRING, name: '名称', placeholder: '请输入表名称' },
        { field: 'tableComment', type: STRING, name: '描述', placeholder: '请输入表描述' }
      ],
      queryParam: {
        tableName: '',
        tableComment: ''
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
    // 打开预览
    previewShow (record) {
      this.$refs.codeGenForm.show(record.tableName, 'preview')
    },
    // 预览代码
    preview (from) {
      codeGenPreview(from).then(res => {
        console.log(res.data)
      })
    },
    // 打开预览
    generateShow (record) {
      this.$refs.codeGenForm.show(record.tableName, 'gen')
    },
    // 生成代码
    generate (from) {
      genCodeZip(from).then(response => {
        this.downFileByData(response, from.tableName + '.zip', 'application/zip')
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
