<template>
  <a-modal
    title="x选择素材"
    :width="750"
    :visible="visible"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
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
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
      :radio-config="{highlight: true}"
      @radio-change="radioChange"
    >
      <vxe-column width="50" type="radio" />
      <vxe-table-column field="name" title="名称"/>
      <vxe-table-column field="mediaId" title="媒体ID"/>
      <vxe-table-column field="updateTime" title="上传时间" />
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button :loading="loading" type="primary" :disabled="!mediaId" @click="handleOk">选择</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { pageFile } from '@/api/third/weChatMedia'

export default {
  name: 'WeChatMediaSelect',
  mixins: [TableMixin],
  data () {
    return {
      visible: false,
      mediaId: null,
      mediaTypes: [],
      queryParam: {
        type: 'image'
      }
    }
  },
  methods: {
    show () {
      this.visible = true
      this.getDictDropDownAsync('WeChatMediaType').then(res => {
        this.mediaTypes = res
      })
      this.query()
    },
    init () {
      this.mediaId = null
      this.loading = true
      pageFile({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    handleOk () {
      this.$emit('ok', this.mediaId)
      this.handleCancel()
    },
    handleCancel () {
      this.visible = false
    },
    radioChange ({ row }) {
      this.mediaId = row.mediaId
    }
  }
}
</script>

<style scoped>

</style>
