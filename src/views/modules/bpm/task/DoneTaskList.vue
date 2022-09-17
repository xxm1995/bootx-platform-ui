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
      <vxe-table-column field="nodeName" title="环节" />
      <vxe-table-column field="taskId" title="任务id"/>
      <vxe-table-column field="instanceId" title="流程id"/>
      <vxe-table-column field="startUserName" title="发起人" />
      <vxe-table-column field="startTime" title="任务开始时间" />
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a disabled href="javascript:" @click="retrieve(row)">取回</a>
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
    <apply-form-show is-view ref="applyFormShow"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import BUserSelectModal from '@/components/Bootx/UserSelectModal/BUserSelectModal'
import ApplyFormShow from '@/views/modules/office/applyshow/ApplyFormShow'
import { pageByDone } from '@/api/bpm/TaskAdmin'

export default {
  name: 'DoneTaskList',
  components: { ApplyFormShow, BUserSelectModal },
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
      pageByDone({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    /**
     * 取回任务
     */
    retrieve (record) {
      this.$confirm({
        title: '警告',
        content: '确实要完成当前任务!',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.loading = true
          this.$message.success('取回成功')
          this.init()
        }
      })
    },
    /**
     * 查看详情
     */
    show (record) {
      this.$refs.applyFormShow.init(record.instanceId)
    }
  },
  mounted () {
    this.init()
  }

}
</script>

<style scoped>

</style>
