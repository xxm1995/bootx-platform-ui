<template>
  <a-drawer
    title="任务执行日志"
    :maskClosable="false"
    :width="1000"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <div class="table-page-search-wrapper">
      <a-form-model :model="queryParam" layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="执行状态">
              <a-select
                allowClear
                style="width: 220px"
                v-model="queryParam.success"
                placeholder="请选择状态"
              >
                <a-select-option :value="true">成功</a-select-option>
                <a-select-option :value="false">失败</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: queryPage}"
    />
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60"/>
      <vxe-table-column field="handlerName" title="处理器名字" />
      <vxe-table-column field="className" title="全限定名" />
      <vxe-table-column field="success" title="执行状态">
        <template v-slot="{row}">
          <a-tag v-if="row.success" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="startTime" title="开始时间" />
      <vxe-table-column field="endTime" title="结束时间" />
      <vxe-table-column field="duration" title="执行时长(毫秒)" />
      <vxe-table-column field="errorMessage" title="错误信息" />
      <vxe-table-column field="createTime" title="创建时间" />
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
    </vxe-pager>
  </a-drawer>

</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { logPage } from '@/api/starter/quartz'
import TemplateEdit from '@/views/modules/notice/template/TemplateEdit'

export default {
  name: 'QuartzJobLogList',
  components: { TemplateEdit },
  mixins: [TableMixin],
  comments: {
  },
  data () {
    return {
      queryParam: {
        success: undefined
      },
      visible: false,
      className: ''
    }
  },
  methods: {
    // 展示列表
    list (className) {
      this.className = className
      this.init()
    },
    init () {
      this.visible = true
      this.queryPage()
    },
    queryPage () {
      this.loading = true
      logPage({
        className: this.className,
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    show (record) {
      this.$refs.quartzJobLogInfo.init(record, 'show')
    },
    handleCancel () {
      this.visible = false
    }
  }

}
</script>

<style scoped>

</style>
