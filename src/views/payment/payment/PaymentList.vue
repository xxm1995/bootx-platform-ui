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
    <payment-edit
      ref="paymentEdit"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { page, del } from '@/api/payment/paymentList'
import PaymentEdit from './PaymentEdit'

export default {
  name: 'PaymentList',
  components: {
    PaymentEdit
  },
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
          title: '用户ID',
          dataIndex: 'userId'
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '商户号',
          dataIndex: 'merchantNo'
        },
        {
          title: '应用appId',
          dataIndex: 'appId'
        },
        {
          title: '业务id',
          dataIndex: 'businessId'
        },
        {
          title: '异步支付',
          dataIndex: 'syncPayTypeCode'
        },
        {
          title: '金额',
          dataIndex: 'amount'
        },
        {
          title: '支付状态',
          dataIndex: 'payStatus'
        },
        {
          title: '支付时间',
          dataIndex: 'payTime'
        },
        {
          title: '备注',
          dataIndex: 'remark'
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
                <a-divider type='vertical' />
                <a-dropdown>
                  <a className='ant-dropdown-link'>
                    更多操作 <a-icon type='down' />
                  </a>
                  <a-menu slot='overlay'>
                    <a-menu-item>
                      <a onClick={(e) => this.edit(record)}>修改</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm title='是否删除' onConfirm={(e) => this.delete(record)} okText='是' cancelText='否'>
                        <a-icon slot='icon' type='question-circle-o' style='color: red' />
                        <a href='javascript:' style='color: red'>删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
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
        this.pagination.total = res.data.total
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
