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
      :refresh="{query: queryPage}"
    />
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60"/>
      <vxe-column field="handlerName" title="处理器名字" />
      <vxe-column field="className" title="全限定名" />
      <vxe-column field="success" title="执行状态">
        <template v-slot="{row}">
          <a-tag v-if="row.success" color="green">成功</a-tag>
          <a-tag v-else color="red">失败</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="startTime" title="开始时间" />
      <vxe-column field="endTime" title="结束时间" />
      <vxe-column field="duration" title="执行时长(毫秒)" />
      <vxe-column field="errorMessage" title="错误信息" />
      <vxe-column field="createTime" title="创建时间" />
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
import { LIST } from '@/components/Bootx/SuperQuery/superQueryCode'

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
      fields: [
      { field: 'success', type: LIST, name: '执行状态', placeholder: '请选择执行状态', list: [{ label: '成功', value: 'true' }, { label: '失败', value: 'false' }] }
    ],
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
    handleCancel () {
      this.visible = false
    }
  }

}
</script>

<style scoped>

</style>
