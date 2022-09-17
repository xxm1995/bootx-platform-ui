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
      <vxe-table-column field="state" title="状态">
        <template v-slot="{row}">
          {{ dictConvert('BpmInstanceState',row.state) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="startTime" title="开始时间" />
      <vxe-table-column field="endTime" title="结束时间" />
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" :disabled="row.state !== 'running'" @click="close(row)">取消</a>
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
import { close, pageMyApply } from '@/api/bpm/instance'
import ApplyFormShow from '@/views/modules/office/applyshow/ApplyFormShow'
import { page } from '@/api/bpm/instanceAdmin'

export default {
  name: 'InstanceList',
  components: { ApplyFormShow },
  mixins: [TableMixin],
  data () {
    return {
      currentBpmModelId: undefined,
      fields: [
        { field: 'code', type: STRING, name: '流程编号', placeholder: '请输入流程编号' },
        { field: 'name', type: STRING, name: '流程名称', placeholder: '请输入流程名称' }
      ]
    }
  },
  methods: {
    /**
     * 初始化
     */
    init () {
      this.loading = true
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
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
    close (record) {
      this.$confirm({
        title: '警告',
        content: '是否取消此流程',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.loading = true
          close(record.instanceId).then(() => {
            this.init()
          })
        }
      })
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
