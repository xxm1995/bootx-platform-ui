<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="支付记录ID">
              <a-input v-model="queryParam.paymentId" placeholder="请输入支付记录ID" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="业务ID">
              <a-input v-model="queryParam.businessId" placeholder="请输入业务ID" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="标题">
              <a-input v-model="queryParam.title" placeholder="请输入标题" />
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
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="paymentId" title="支付记录ID">
        <template v-slot="{row}">
          <a @click="showPayment(row.paymentId)">
            {{ row.paymentId }}
          </a>
        </template>
      </vxe-table-column>
      <vxe-table-column field="businessId" title="原业务ID"/>
      <vxe-table-column field="title" title="原支付标题"/>
      <vxe-table-column field="amount" title="退款金额"/>
      <vxe-table-column field="refundableBalance" title="剩余可退金额"/>
      <vxe-table-column field="refundTime" title="退款时间"/>
      <vxe-table-column field="refundStatus" title="状态">
        <template v-slot="{row}">
          <a-tag>{{ row.refundStatus?'成功':'失败' }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column fixed="right" width="50" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
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
    <refund-record-info ref="refundRecordInfo" @ok="handleOk"/>
    <payment-info ref="paymentInfo"/>
  </a-card>
</template>

<script>
  import { page } from '@/api/payment/refundRecord'
  import RefundRecordInfo from './RefundRecordInfo'
  import { TableMixin } from '@/mixins/TableMixin'
  import PaymentInfo from '@/views/modules/payment/order/payment/PaymentInfo'
  export default {
    name: 'RefundRecordList',
    components: {
      RefundRecordInfo,
      PaymentInfo
    },
    mixins: [TableMixin],
    data () {
      return {
        queryParam: {
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
      show (record) {
        this.$refs.refundRecordInfo.init(record.id, 'show')
      },
      showPayment (paymentId) {
        this.$refs.paymentInfo.init(paymentId, 'show')
      }
    },
    created () {
      this.init()
    }
  }
</script>

<style scoped>

</style>
