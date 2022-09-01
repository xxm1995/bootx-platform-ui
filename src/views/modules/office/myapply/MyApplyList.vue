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
        <a-button type="primary" icon="plus" @click="modelShow">发起流程</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="instanceId"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="标题" />
      <vxe-table-column field="defMame" title="流程名称" />
      <vxe-table-column field="instanceId" title="实例ID" />
      <vxe-table-column field="startUserName" title="发起人" />
      <vxe-table-column field="startTime" title="开始时间" />
      <vxe-table-column field="endTime" title="结束时间" />
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
<!--          <a-divider type="vertical"/>-->
<!--          <a href="javascript:" @click="invalid(row)">作废</a>-->
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
    <!--  流程类型选择弹窗  -->
    <a-modal
      title="选择要发起的流程"
      :visible="modelVisible"
      :maskClosable="true"
      placement="right"
      :closable="true"
      @ok="handleOk"
      @cancel="modelCancel"
    >
      <a-select
        v-model="currentBpmModelId"
        :filter-option="selectSearch"
        :options="bpmModelList"
        style="width: 100%"
        placeholder="选择要发起的流程"
      />
      <template #footer>
        <a-button @click="modelCancel">取消</a-button>
        <a-button :disabled="!currentBpmModelId" type="primary" @click="apply">开始申请</a-button>
      </template>
    </a-modal>
    <apply-form ref="applyForm" @ok="init"/>
    <apply-form-show is-view ref="applyFormShow"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { findMainProcess } from '@/api/bpm/model'
import ApplyForm from '@/views/modules/office/myapply/ApplyForm'
import { pageMyApply } from '@/api/bpm/instance'
import ApplyFormShow from '@/views/modules/office/applyshow/ApplyFormShow'

export default {
  name: 'MyApplyList',
  components: { ApplyFormShow, ApplyForm },
  mixins: [TableMixin],
  data () {
    return {
      modelVisible: false,
      bpmModelList: [],
      currentBpmModelId: undefined,
      fields: [
        { field: 'code', type: STRING, name: '流程编号', placeholder: '请输入流程编号' },
        { field: 'name', type: STRING, name: '流程名称', placeholder: '请输入流程名称' }
      ]
    }
  },
  methods: {
    /**
     * 初始化基础数据
     */
    async initData () {
      findMainProcess().then(res => {
        this.bpmModelList = res.data
        if (this.bpmModelList) {
          this.currentBpmModelId = this.bpmModelList[0].value
        }
      })
    },
    /**
     * 初始化
     */
    init () {
      this.loading = true
      pageMyApply({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    /**
     * 发起申请
     */
    apply () {
      this.modelCancel()
      this.$refs.applyForm.init(this.currentBpmModelId)
    },
    /**
     * 查看详情
     */
    show (record) {
      this.$refs.applyFormShow.init(record.instanceId)
    },
    /**
     * 作废流程
     */
    invalid (record) {

    },
    /**
     * 显示小弹窗
     */
    modelShow () {
      this.modelVisible = true
    },
    /**
     * 关闭小弹窗
     */
    modelCancel () {
      this.modelVisible = false
    }
  },
  mounted () {
    this.initData()
    this.init()
  }
}
</script>

<style scoped>

</style>
