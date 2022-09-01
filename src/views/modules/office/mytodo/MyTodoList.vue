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
      <vxe-table-column fixed="right" width="150" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="handle(row)">办理</a>
          <!--          <a-divider type="vertical"/>-->
          <!--          <a href="javascript:" @click="reject(row)">驳回</a>-->
          <a-divider type="vertical"/>
          <a href="javascript:" @click="assignee(row)">委派</a>
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
    <b-user-select-modal ref="userSelectModal" @ok="assigneeCallback" title="选择委派的用户" :multiple="false"/>
    <apply-form-show ref="applyFormShow"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { assignee, pageMyTodo, pass, reject } from '@/api/bpm/task'
import BUserSelectModal from '@/components/Bootx/UserSelectModal/BUserSelectModal'
import ApplyFormShow from '@/views/modules/office/applyshow/ApplyFormShow'

export default {
  name: 'MyTodoList',
  components: { ApplyFormShow, BUserSelectModal },
  mixins: [TableMixin],
  data () {
    return {
      // 要被委派新用户的任务id
      assigneeTaskId: '',
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
     * 处理任务
     */
    handle (record) {
      this.$refs.applyFormShow.init(record.instanceId)
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
    },
    /**
     * 驳回
     */
    reject (record) {
      this.$confirm({
        title: '警告',
        content: '确实要驳回当前任务!',
        onOk: () => {
          this.loading = true
          reject({
            taskId: record.taskId,
            reason: '意见'
          }).then(() => {
            this.$message.success('任务已驳回')
            this.init()
          })
        }
      })
    },
    /**
     * 委派
     */
    assignee (record) {
      this.assigneeTaskId = record.taskId
      this.$refs.userSelectModal.init()
    },
    /**
     * 委派 选择用户后回调
     */
    assigneeCallback (userId, user) {
      this.loading = true
      assignee(this.assigneeTaskId, userId).then(() => {
        this.$message.success(`任务以委派给 [${user.name}] 处理`)
        this.init()
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
