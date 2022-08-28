<template>
  <a-card :bordered="false">
    <b-query
      query-param="queryParam"
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
      <template #buttons>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="taskId"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="instanceName" title="业务标题" />
      <vxe-table-column field="defName" title="流程名称" />
      <vxe-table-column field="taskName" title="环节" />
      <vxe-table-column field="taskId" title="任务id"/>
      <vxe-table-column field="instanceId" title="流程id"/>
      <vxe-table-column field="startUserName" title="发起人" />
      <vxe-table-column field="startTime" title="任务开始时间" />
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="pass(row)">办理</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="show(row)">委派</a>
        </template>
      </vxe-table-column>
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
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { pageMyTodo, pass } from '@/api/bpm/task'

export default {
  name: 'MyTaskList',
  mixins: [TableMixin],
  data () {
    return {
      fields: [
        { field: 'code', type: STRING, name: '流程编号', placeholder: '请输入流程编号' },
        { field: 'code', type: STRING, name: '流程名称', placeholder: '请输入流程名称' }
      ]
    }
  },
  methods: {
    init () {
      this.loading = true
      pageMyTodo({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    /**
     * 完成任务
     */
    pass (record) {
      this.$confirm({
        title: '警告',
        content: '确实要完成当前任务!',
        onOk: () => {
          this.loading = true
          pass({
            taskId: record.taskId,
            reason: '意见'
          }).then(() => {
            this.$message.success('任务已完成')
            this.init()
          })
        }
      })
    }
  },
  mounted () {
    this.init()
  }

}
</script>

<style scoped>

</style>
