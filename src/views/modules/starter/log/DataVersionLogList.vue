<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="数据名称">
              <a-input v-model="queryParam.dataName" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="数据主键">
              <a-input v-model="queryParam.dataId" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
              <a-button @click="() => this.queryParam = {}">重置</a-button>
            </a-space>
          </a-col>
        </a-row>
      </a-form>
    </div>
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
      <vxe-table-column type="checkbox" width="40"/>
      <vxe-table-column field="dataName" title="数据名称" />
      <vxe-table-column field="dataId" title="数据主键" />
      <vxe-table-column field="dataContent" title="数据内容" />
      <vxe-table-column field="version" title="数据版本" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column title="操作" fixed="right" width="120">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
        </template>
      </vxe-table-column>
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
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      dataVersionPage({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.tableData = res.data.records
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
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
