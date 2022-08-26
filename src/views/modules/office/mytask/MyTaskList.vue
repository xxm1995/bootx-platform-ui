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
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="modelType" title="流程类型" />
      <vxe-table-column field="publish" title="发布状态">
        <template v-slot="{row}">
          <a-tag>{{ dictConvert('BpmModelPublish',row.publish) }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="mainProcess" title="是否主流程">
        <template v-slot="{row}">
          <a-tag v-if="row.mainProcess" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="processVersion" title="流程版本号">
        <template v-slot="{row}">
          <a-tag>{{ row.processVersion||'无' }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="320" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">办理</a>
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

  },
  mounted() {
    this.init()
  }

}
</script>

<style scoped>

</style>
