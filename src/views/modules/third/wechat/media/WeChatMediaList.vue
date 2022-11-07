<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="类型">
              <a-select
                v-model="queryParam.type"
                :default-value="queryParam.type"
                :options="mediaTypes"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
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
          <a-upload
            name="file"
            :multiple="false"
            :accept="acceptType"
            :action="uploadAction"
            :headers="tokenHeader"
            :data="uploadData"
            :showUploadList="false"
            @change="uploadChange">
            <a-button type="primary">
              <a-icon type="upload"/>
              {{ `素材上传(${dictConvert('WeChatMediaType', queryParam.type)})` }}
            </a-button>
          </a-upload>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="名称"/>
      <vxe-column field="mediaId" title="媒体ID"/>
      <vxe-column field="updateTime" title="上传时间" />
      <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看素材URL</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a-popconfirm
              title="是否删除"
              @confirm="remove(row)"
              okText="是"
              cancelText="否">
              <a href="javascript:" style="color: red">删除</a>
            </a-popconfirm>
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
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { pageFile, deleteFile } from '@/api/third/weChatMedia'
import { UploadMixin } from '@/mixins/UploadMixin'
import { getDictDropDown } from '@/components/Bootx/Dict/DictUtils'

export default {
  name: 'WeChatMediaList',
  mixins: [TableMixin, UploadMixin],
  computed: {
    // 上传地址
    uploadAction () {
      return process.env.VUE_APP_API_BASE_URL + '/wechat/media/uploadFile'
    },
    // 表单信息
    uploadData () {
      return {
        mediaType: this.queryParam.type
      }
    },
    // 上传类型限定
    acceptType () {
      switch (this.queryParam.type) {
        case 'image': {
          return 'image/*'
        }
        case 'voice': {
          return 'audio/*'
        }
        case 'video': {
          return 'video/*'
        }
        default: {
          return null
        }
      }
    }
  },
  data () {
    return {
      mediaTypes: [],
      queryParam: {
        type: 'image'
      }
    }
  },
  methods: {
    initData () {
      getDictDropDown('WeChatMediaType').then(res => {
        this.mediaTypes = res
      })
    },
    init () {
      this.loading = true
      pageFile({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    show (record) {
      this.$info({
        title: '微信媒体资源地址',
        content: record.url
      })
    },
    remove (record) {
      deleteFile(record.mediaId).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    /**
     * 上传成功
     */
    uploadSuccess (info) {
      this.$message.success(`${info.file.name} 上传成功!`)
      this.init()
    }
  },
  created () {
    this.initData()
    this.init()
  }
}
</script>

<style scoped>

</style>
