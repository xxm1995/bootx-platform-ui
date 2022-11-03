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
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="paymentId" title="支付记录单号">
        <template v-slot="{row}">
          <a @click="showPayment(row.paymentId)">
            {{ row.paymentId }}
          </a>
        </template>
      </vxe-column>
      <vxe-column field="businessId" title="原业务ID"/>
      <vxe-column field="title" title="原支付标题"/>
      <vxe-column field="amount" title="退款金额"/>
      <vxe-column field="refundableBalance" title="剩余可退金额"/>
      <vxe-column field="refundTime" title="退款时间"/>
      <vxe-column field="refundStatus" title="状态">
        <template v-slot="{row}">
          <a-tag>{{ row.refundStatus?'成功':'失败' }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column fixed="right" width="50" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
        </template>
      </vxe-column>
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
  import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
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
          paymentId: '',
          businessId: '',
          title: ''
        },
        fields: [
          { field: 'paymentId', type: STRING, name: '支付单号', placeholder: '请输入支付单号' },
          { field: 'businessId', type: STRING, name: '业务ID', placeholder: '请输入业务ID' },
          { field: 'title', type: STRING, name: '标题', placeholder: '请输入标题' }
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
