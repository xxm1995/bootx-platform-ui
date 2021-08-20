<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="商户号">
              <a-input v-model="queryParam.merchantNo" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="商户名称">
              <a-input v-model="queryParam.merchantName" placeholder=""/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="() => {this.resetPage();this.init()}">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.paymentEdit.edit('','add')">新建</a-button>
    </div>
    <a-table
      bordered
      :columns="columns"
      :dataSource="tableData"
      :loading="loading"
      :pagination="pagination"
      :rowKey="record => record.id"
      @change="handleTableChange"
      :scroll="{ x: 1500 }"
    >
    </a-table>
<!--    <payment-edit-->
<!--      ref="paymentEdit"-->
<!--      @ok="handleOk"-->
<!--    />-->
  </a-card>
</template>

<script>
import { page, del } from '@/api/payment/payNotifyRecord'
// import PaymentEdit from './PaymentEdit'

export default {
  name: 'PayNotifyRecord',
  // components: {
  //   PaymentEdit
  // },
  data () {
    return {
      loading: false,
      columns: [
        {
          title: '#',
          width: '80px',
          customRender: (text, record, index) => {
            return (
              <div>
                {index + 1}
              </div>
            )
          }
        },
        {
          title: '支付记录ID',
          dataIndex: 'paymentId',
          width: '180px'
        },
        {
          title: '消息',
          dataIndex: 'msg'
        },
        {
          title: '通知时间',
          dataIndex: 'notifyTime'
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          customRender: (text, record, index) => {
            return (
              <div>
                <a href="javascript:"
                   onClick={(e) => this.show(record)}
                >查看</a>
              </div>
            )
          }
        }
      ],
      tableData: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true
      },
      pages: {
        size: 10,
        current: 1
      },
      queryParam: {
        merchantNo: '',
        merchantName: ''
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
        this.pagination.total = +res.data.total
        // 当前页取决于后端
        this.pagination.current = Number(res.data.current)
        this.loading = false
      })
    },
    // 重置当前页数
    resetPage () {
      this.pages = {
        size: 10,
        current: 1,
        pages: 0
      }
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.pages.size = pagination.pageSize
      this.pages.current = pagination.current
      this.init()
    },
    edit (record) {
      this.$refs.paymentEdit.edit(record.id, 'edit')
    },
    delete (record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    show (record) {
      this.$refs.paymentEdit.edit(record.id, 'show')
    },
    handleOk () {
      this.init()
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
