<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="24">
            <a-form-item label="权限路径">
              <a-input v-model="queryParam.path" placeholder="请输入要查询的权限路径"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="权限标识">
              <a-input v-model="queryParam.code" placeholder="请输入要查询的权限标识"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="权限名称">
              <a-input v-model="queryParam.name" placeholder="请输入要查询的权限名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="权限分组">
              <a-input v-model="queryParam.groupName" placeholder="请输入要查询的权限分组"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
        <a-popconfirm
          title="是否同步系统请求资源"
          @confirm="syncSystem()"
          okText="是"
          cancelText="否">
          <a-button style="margin-left: 8px" icon="sync">同步系统资源</a-button>
        </a-popconfirm>
      </template>
    </vxe-toolbar>
    <vxe-table
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="path" title="请求路径" />
      <vxe-table-column field="name" title="权限名称" />
      <vxe-table-column field="code" title="权限标识" />
      <vxe-table-column field="groupName" title="请求分组" />
      <vxe-table-column field="enable" title="启用鉴权" >
        <template v-slot="{row}">
          <a-tag v-if="row.enable" color="green">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="generate" title="系统生成" >
        <template v-slot="{row}">
          <a-tag v-if="row.generate" color="red">是</a-tag>
          <a-tag v-else color="green">否</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="描述" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="210" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="是否删除请求权限"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
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
    <path-edit
      ref="pathEdit"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { del, page, syncSystem } from '@/api/system/permPath'
import PathEdit from './PathEdit'
import { TableMixin } from '@/mixins/TableMixin'
export default {
  name: 'PathList',
  components: {
    PathEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        code: '',
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
        this.tableData = res.data.records
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    add () {
      this.$refs.pathEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.pathEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.pathEdit.init(record.id, 'show')
    },
    remove (record) {
      this.loading = true
      del(record.id).then(() => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    // 同步
    syncSystem () {
      syncSystem().then(() => {
        this.$message.info('同步中，请稍后重新查看路径权限信息')
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
