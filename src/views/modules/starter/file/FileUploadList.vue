<template>
  <a-card :bordered="false">
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-upload
          name="file"
          :multiple="false"
          :action="uploadAction"
          :headers="tokenHeader"
          :showUploadList="false"
          @change="handleChange">
          <a-button type="primary">
            <a-icon type="upload"/>
            文件上传
          </a-button>
        </a-upload>
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
      <vxe-table-column field="fileSize" title="文件大小" />
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
import { page } from '@/api/starter/fileUpload'
import { getFileDownloadUrl, getFilePreviewUrl } from '@/api/common/fileUpload'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'FileUploadList',
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
      }
    }
  },
  computed: {
    // 上传地址
    uploadAction () {
      return process.env.VUE_APP_API_BASE_URL + '/file/upload'
    },
    // 请求头消息
    tokenHeader () {
      // 从 localstorage 获取 token
      const token = storage.get(ACCESS_TOKEN)
      return {
        AccessToken: token
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
    },
    handleChange (info) {
      if (info.file.status === 'done') {
        if (!info.file.response.code) {
          this.init()
          this.$message.success(`${info.file.name} 上传成功!`)
        } else {
          this.$message.error(`${info.file.response.msg}`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error('上传失败')
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
