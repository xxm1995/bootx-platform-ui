<template>
  <a-card :bordered="false">
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
      :refresh="{query: init}"
    />
    <vxe-table
      row-id="id"
      size="medium"
      @checkbox-change="checkboxChange"
      @checkbox-all="checkboxChange"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="checkbox" width="40"/>
      <vxe-column field="dataName" title="数据名称" />
      <vxe-column field="dataId" title="数据主键" />
      <vxe-column field="dataContent" title="数据内容" />
      <vxe-column field="version" title="数据版本" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column title="操作" fixed="right" width="120">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
    </vxe-pager>
    <data-version-log-info ref="dataVersionLogInfo"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { dataVersionPage } from '@/api/starter/log'
import DataVersionLogInfo from './DataVersionLogInfo'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

export default {
  name: 'DataVersionLogList',
  mixins: [TableMixin],
  components: {
    DataVersionLogInfo
  },
  data () {
    return {
      selectList: [],
      queryParam: {
        dataName: '',
        dataId: ''
      },
      fields: [
        { field: 'dataName', type: STRING, name: '数据名称', placeholder: '请输入数据名称' },
        { field: 'dataId', type: STRING, name: '数据主键', placeholder: '请输入数据主键' }
      ]
    }
  },
  methods: {
    init () {
      this.loading = true
      dataVersionPage({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    show (record) {
      this.$refs.dataVersionLogInfo.init(record.id, 'show')
    },
    // 多选变动事件
    checkboxChange () {
      this.selectList = this.$refs.table.getCheckboxRecords()
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
