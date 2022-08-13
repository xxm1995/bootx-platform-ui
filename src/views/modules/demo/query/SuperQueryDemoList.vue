<template>
  <a-card :bordered="false">
    <b-query
      :query-param="queryParam"
      :default-item-md="8"
      :disabled-query="superQueryFlag"
      :fields="fields"
      @query="query"
      @reset="resetQuery"
    />
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
        <b-super-query
          :queryState="superQueryFlag"
          :fields="queryFields"
          :width="880"
          button-title="超级查询"
          model-title="超级查询器"
          @query="superQuery"
          @reset="resetQuery"
        />
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="age" title="年龄" />
      <vxe-table-column field="vip" title="是否vip">
        <template v-slot="{row}">
          <a-tag v-if="row.vip" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="birthday" title="生日" />
      <vxe-table-column field="workTime" title="上班时间" />
      <vxe-table-column field="registrationTime" title="注册时间" />
      <vxe-table-column field="political" title="政治面貌" >
        <template v-slot="{row}">
          {{ dictConvert('Political',row.political) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注" />
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
            title="是否删除"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
      />
    </vxe-pager>
    <super-query-demo-edit
      ref="superQueryDemoEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { page, del, superPage } from '@/api/demo/superQueryDemo'
import SuperQueryDemoEdit from './SuperQueryDemoEdit'
import { TableMixin } from '@/mixins/TableMixin'
import { BOOLEAN, DATE, DATE_TIME, LIST, NUMBER, STRING, TIME } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'SuperQueryDemoList',
  components: {
    SuperQueryDemoEdit
  },
  mixins: [TableMixin],
  computed: {
    // 超级查询字段
    queryFields () {
      return [
        { field: 'name', name: '姓名', type: STRING },
        { field: 'age', name: '年龄', type: NUMBER },
        { field: 'vip', name: '是否vip', type: BOOLEAN },
        { field: 'birthday', name: '生日', type: DATE },
        { field: 'workTime', name: '上班时间', type: TIME },
        { field: 'registrationTime', name: '注册时间', type: DATE_TIME },
        { field: 'political', name: '政治面貌', type: LIST, list: this.politicalList }
      ]
    }
  },
  data () {
    return {
      // 政治面貌
      politicalList: [],
      fields: [
        { field: 'name', name: '姓名', type: STRING },
        { field: 'remark', name: '姓名', type: STRING }
      ],
      queryParam: {
      }
    }
  },
  methods: {
    init () {
      this.loading = true
      this.getDictDropDownAsync('Political').then(res => {
        this.politicalList = res
      })
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    add () {
      this.$refs.superQueryDemoEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.superQueryDemoEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.superQueryDemoEdit.init(record.id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    // 超级查询
    superQuery (queryParams) {
      this.superQueryFlag = true
      this.loading = true
      superPage(
        this.pages, { queryParams }
      ).then(res => {
        this.pageQueryResHandel(res, this)
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
