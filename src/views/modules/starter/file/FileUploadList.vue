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
      <vxe-table-column field="fileName" title="文件名称" />
      <vxe-table-column field="fileSuffix" title="文件后缀" />
      <vxe-table-column field="fileType" title="文件类型" />
      <vxe-table-column field="fileSize" title="文件大小" >
        <template v-slot="{row}">
          {{ row.fileSize/1024 }}KB
        </template>
      </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="down(row)">下载</a>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handleTableChange"
    />
    <file-upload-edit ref="fileUploadEdit" @ok="init"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { page } from '@/api/starter/fileUpload'
import FileUploadEdit from './FileUploadEdit'
import { getFileDownloadUrl, getFilePreviewUrl } from '@/api/common/fileUpload'

export default {
  name: 'FileUploadList',
  mixins: [TableMixin],
  components: {
    FileUploadEdit
  },
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
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.tableData = res.data.records
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    // 上传
    upload () {
      this.$refs.fileUploadEdit.init()
    },
    // 下载
    down (record) {
      getFileDownloadUrl(record.id).then(res => {
        window.open(res.data)
      })
    },
    // 查看
    show (record) {
      getFilePreviewUrl(record.id).then(res => {
        window.open(res.data)
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
