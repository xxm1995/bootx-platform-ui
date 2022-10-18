<template>
  <a-card :bordered="false">
    <b-query
      query-param="queryParam"
      v-model="queryParam"
      :fields="fields"
      :default-item-md="6"
      @query="query"
      @reset="() => queryParam = {}"
    />
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-space>
          <a-button type="primary" icon="plus" @click="add">新建</a-button>
          <a-dropdown v-show="batchOperateFlag">
            <a-button > 批量操作 <a-icon type="down" /></a-button>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="batchUpdateEnable(true)">批量启用</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="batchUpdateEnable(false)">批量停用</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="removeDataScopeBatch()">批量删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-popconfirm
            title="是否同步系统请求资源"
            @confirm="syncSystem()"
            okText="是"
            cancelText="否">
            <a-button icon="sync">同步系统资源</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      ref="table"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="checkbox" width="40"/>
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
      <vxe-table-column fixed="right" width="150" :showOverflow="false" title="操作">
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
import { batchUpdateEnable, del, delBatch, page, syncSystem } from '@/api/system/permPath'
import PathEdit from './PathEdit'
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'PathList',
  components: {
    PathEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        path: '',
        code: '',
        name: '',
        groupName: ''
      },
      fields: [
        { field: 'path', type: STRING, name: '权限路径', placeholder: '请输入权限路径' },
        { field: 'code', type: STRING, name: '权限标识', placeholder: '请输入流程标识' },
        { field: 'name', type: STRING, name: '权限名称', placeholder: '请输入权限名称' },
        { field: 'groupName', type: STRING, name: '权限分组', placeholder: '请输入权限分组' }
      ]
    }
  },
  methods: {
    init () {
      this.batchOperateFlag = false
      this.loading = true
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
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
    // 批量删除
    removeDataScopeBatch () {
      const ids = this.$refs.table.getCheckboxRecords().map(o => o.id)
      const that = this
      this.$confirm({
        title: '是否批量删除选中的数据',
        okText: '确定',
        cancelText: '取消',
        onOk: async function () {
          delBatch(ids).then(() => {
            that.init()
            that.$message.info('批量删除成功')
          })
        }
      })
    },
    // 选中全部
    selectAllEvent () {
      const records = this.$refs.table.getCheckboxRecords()
      this.batchOperateFlag = !!records.length
    },
    // 选中事件
    selectChangeEvent () {
      const records = this.$refs.table.getCheckboxRecords()
      this.batchOperateFlag = !!records.length
    },
    // 批量启停用
    batchUpdateEnable (type) {
      const ids = this.$refs.table.getCheckboxRecords().map(o => o.id)
      const that = this
      this.$confirm({
        title: type ? '是否批量启用' : '是否批量停用',
        okText: '确定',
        cancelText: '取消',
        onOk: async function () {
          batchUpdateEnable({
            permPathIds: ids,
            enable: type
          }).then(() => {
            that.init()
            that.$message.info('批量修改状态成功')
          })
        }
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
