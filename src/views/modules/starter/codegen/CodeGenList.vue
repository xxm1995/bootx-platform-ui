<template>
  <a-card :bordered="false">
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-button type="primary" icon="upload" @click="upload">上传</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="tableName" title="表名" />
      <vxe-table-column field="engine" title="引擎类型" />
      <vxe-table-column field="tableComment" title="表表述" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="preview(row)">预览</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="gen(row)">生成</a>
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
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { page } from '@/api/starter/codeGen'

export default {
  name: 'CodeGenList',
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      page({
        ...this.pages
      }).then(res => {
        this.tableData = res.data.records
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    // 预览代码
    preview (record) {

    },
    // 生成代码
    generate (record) {

    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
