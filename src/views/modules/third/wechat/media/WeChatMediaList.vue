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
            :action="uploadAction"
            :headers="tokenHeader"
            :data="uploadData"
            :showUploadList="false"
            @change="handleChange">
            <a-button type="primary">
              <a-icon type="upload"/>
              素材上传
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
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称"/>
      <vxe-table-column field="publish" title="启用状态">
        <template v-slot="{row}">
          <a-tag v-if="row.publish" color="green">已发布</a-tag>
          <a-tag v-else color="red">草稿</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注"/>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="220" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="designEdit(row)">设计</a>
          </span>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="designShow(row)">菜单预览</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="publish(row)">菜单发布</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否删除"
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
import { pageNews, pageFile, deleteFile } from '@/api/third/weChatMedia'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export default {
  name: 'WeChatMediaList',
  mixins: [TableMixin],
  computed: {
    // 上传地址
    uploadAction () {
      return process.env.VUE_APP_API_BASE_URL + '/wechat/media/uploadFile'
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
  data () {
    return {
      mediaTypes: [],
      queryParam: {
        type: 'image'
      },
      uploadData: {
        mediaType: 'image'
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      this.getDictDropDownAsync('WeChatMediaType').then(res => {
        this.mediaTypes = res
        console.log(this.mediaTypes)
      })
      if (this.queryParam.type === 'news') {
        pageNews({
          ...this.queryParam,
          ...this.pages
        }).then(res => {
          this.pageQueryResHandel(res, this)
        })
      } else {
        pageFile({
          ...this.queryParam,
          ...this.pages
        }).then(res => {
          this.pageQueryResHandel(res, this)
        })
      }
    },
    add () {
      this.$refs.weChatMenuEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.weChatMenuEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.weChatMenuEdit.init(record.id, 'show')
    },
    remove (record) {
      deleteFile(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
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
