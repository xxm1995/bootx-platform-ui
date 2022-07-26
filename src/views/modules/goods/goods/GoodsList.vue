<template>
  <a-card>
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="查询">
              <a-input v-model="queryParam.name" allow-clear placeholder="请输入商品名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
              <a-button @click="restQuery">重置</a-button>
            </a-space>
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
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="商品名称"/>
      <vxe-table-column field="displayLowerPrice" title="最低价格"/>
      <vxe-table-column field="displayUpperPrice" title="最高价格"/>
      <vxe-table-column field="enable" title="启用状态">
        <template v-slot="{row}">
          {{ row.enable?'启用':'停用' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="描述"/>
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
      @page-change="handleTableChange"/>
    <goods-edit ref="goodsEdit" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { page } from '@/api/goods/goods'
import GoodsEdit from './GoodsEdit'

export default {
  name: 'GoodsList',
  components: {
    GoodsEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
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
      this.$refs.goodsEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.goodsEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.goodsEdit.init(record.id, 'show')
    },
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
