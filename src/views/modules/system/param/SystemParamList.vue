<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="参数名称">
              <a-input v-model="queryParam.name" placeholder=""/>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="参数键名">
              <a-input v-model="queryParam.paramKey" placeholder=""/>
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
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="参数名称" />
      <vxe-table-column field="paramKey" title="参数键名" />
      <vxe-table-column field="value" title="参数值" />
      <vxe-table-column field="type" title="参数类型" >
        <template v-slot="{row}">
          <a-tag>{{ dictConvert(paramType,row.type) }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column align="" field="internal" title="内置参数" >
        <template v-slot="{row}">
          <a-tag v-if="row.internal" color="red">是</a-tag>
          <a-tag v-else color="green">否</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="mark" title="备注" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="210" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否删除该参数"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" :disabled="row.internal" :style="row.internal?{}:{color: 'red'}">删除</a>
          </a-popconfirm>
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
      @page-change="handleTableChange"
    />
    <system-param-edit
      ref="systemParamEdit"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import SystemParamEdit from './SystemParamEdit'
import { page, del } from '@/api/system/param'

export default {
  name: 'SystemParamList',
  mixins: [TableMixin],
  components: {
    SystemParamEdit
  },
  data () {
    return {
      paramType: 'ParamType',
      queryParam: {
        paramKey: '',
        name: ''
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    add () {
      this.$refs.systemParamEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.systemParamEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.systemParamEdit.init(record.id, 'show')
    },
    remove (record) {
      del(record.id).then(() => {
        this.$message.info('删除成功')
        this.init()
      })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>