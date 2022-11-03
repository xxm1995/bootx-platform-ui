<template>
  <a-card :bordered="false">
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
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="chineseName" title="中文名字" />
      <vxe-column field="password" title="密码" />
      <vxe-column field="idCard" title="身份证号" />
      <vxe-column field="mobilePhone" title="手机号" />
      <vxe-column field="carLicense" title="车牌号" />
      <vxe-column field="email" title="电子邮件" />
      <vxe-column field="other" title="其他" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="150" :showOverflow="false" title="操作">
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
            title="是否删除"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-column>
    </vxe-table>
    <vxe-pager
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <data-sensitive-demo-edit ref="dataSensitiveDemoEdit" @ok="init"/>
  </a-card>
</template>

<script>
import DataSensitiveDemoEdit from './DataSensitiveDemoEdit'
import { del, page } from '@/api/demo/dataSensitiveDemo'
import { TableMixin } from '@/mixins/TableMixin'

export default {
  name: 'DataSensitiveDemoList',
  mixins: [TableMixin],
  components: {
    DataSensitiveDemoEdit
  },
  data () {
    return {
      queryParam: {
        name: '',
        creatorName: '',
        remark: ''
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
      this.$refs.dataSensitiveDemoEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.dataSensitiveDemoEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dataSensitiveDemoEdit.init(record.id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
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
