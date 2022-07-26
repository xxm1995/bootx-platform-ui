<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="字典编码">
              <a-input v-model="queryParam.code" placeholder="请输入字典编码" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="字典名称">
              <a-input v-model="queryParam.name" placeholder="请输入字典名称"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="分组标签">
              <a-input v-model="queryParam.groupTag" placeholder="请输入分组标签" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-button type="primary" icon="plus" @click="$refs.dictEdit.init('','add')">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60"/>
      <vxe-table-column field="code" title="编码" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="groupTag" title="分类标签">
        <template v-slot="{row}">
          <a-tag color="green">{{ row.groupTag||'空' }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="描述" />
      <vxe-table-column title="操作" fixed="right" width="220">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="itemList(row)">字典配置</a>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除字典"
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
      @page-change="handleTableChange">
    </vxe-pager>
    <dict-edit
      ref="dictEdit"
      @ok="handleOk"
    />
    <dict-item-list
      ref="dictItemList"
    />
  </a-card>
</template>

<script>
import { page, del } from '@/api/system/dict'
import DictEdit from './DictEdit'
import DictItemList from './DictItemList'
import { TableMixin } from '@/mixins/TableMixin'
export default {
  name: 'DictList',
  components: {
    DictEdit,
    DictItemList
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        code: '',
        name: '',
        groupTag: ''
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
    edit (record) {
      this.$refs.dictEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dictEdit.init(record.id, 'show')
    },
    itemList (record) {
      this.$refs.dictItemList.list(record)
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
