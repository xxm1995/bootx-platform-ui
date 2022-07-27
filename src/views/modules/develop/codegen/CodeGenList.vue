<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="8" :sm="24">
            <a-form-item label="表名称">
              <a-input v-model="queryParam.tableName" placeholder="请输入表名称" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="表描述">
              <a-input v-model="queryParam.tableComment" placeholder="请输入表描述" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
              <a-button @click="() => this.queryParam = {}">重置</a-button>
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
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="tableName" title="表名称" />
      <vxe-table-column field="engine" title="引擎类型" />
      <vxe-table-column field="tableComment" title="表表述" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
<!--          <a href="javascript:" @click="previewShow(row)">预览</a>-->
<!--          <a-divider type="vertical" />-->
          <a href="javascript:" @click="generateShow(row)">生成</a>
        </template>
      </vxe-table-column>
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
export default {
  name: 'CodeGenList',
  mixins: [TableMixin],
  components: {
    CodeGenForm
  },
  data () {
    return {
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
        if (response.type === 'application/octet-stream') {
          // 获取http头部的文件名信息，若无需重命名文件，将下面这行删去
          const fileName = from.tableName + '.zip'
          /* 兼容ie内核，360浏览器的兼容模式 */
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const blob = new Blob([response], { type: 'application/zip' })
            window.navigator.msSaveOrOpenBlob(blob, fileName)
          } else {
            /* 火狐谷歌的文件下载方式 */
            const blob = new Blob([response], { type: 'application/zip' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a') // 创建a标签
            link.href = url
            link.download = fileName // 文件重命名，若无需重命名，将该行删去
            link.click()
            URL.revokeObjectURL(url) // 释放内存
          }
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
