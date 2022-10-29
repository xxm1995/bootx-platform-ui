<template>
  <a-card :bordered="false">
    <b-query
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
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="code" title="编号" />
      <vxe-table-column field="name" title="配置名称" />
      <vxe-table-column field="accessToken" title="AccessToken" />
      <vxe-table-column field="enableSignatureCheck" title="是否开启验签" >
        <template v-slot="{row}">
          <a-tag v-if="row.enableSignatureCheck" color="green">开启</a-tag>
          <a-tag v-else color="red">关闭</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="signSecret" title="验签秘钥" />
      <vxe-table-column field="remark" title="备注" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="150" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除配置"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <ding-robot-config-edit
      ref="dingRobotConfigEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, page } from '@/api/third/dingRobotConfig'
import DingRobotConfigEdit from './DingRobotConfigEdit'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

export default {
  name: 'DingRobotConfigList',
  components: {
    DingRobotConfigEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        code: '',
        name: '',
        accessToken: ''
      },
      fields: [
        { field: 'code', type: STRING, name: '编号', placeholder: '请输入编号' },
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' },
        { field: 'accessToken', type: STRING, name: 'AccessToken', placeholder: '请输入AccessToken' }
      ]
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
      this.$refs.dingRobotConfigEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.dingRobotConfigEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dingRobotConfigEdit.init(record.id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
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
