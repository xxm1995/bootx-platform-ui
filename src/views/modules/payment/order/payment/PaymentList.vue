<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
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
      <vxe-table-column field="businessId" title="业务id"/>
      <vxe-table-column field="title" title="标题"/>
      <vxe-table-column field="amount" title="金额"/>
      <vxe-table-column field="payStatus" title="支付状态">
        <template v-slot="{row}">
          {{ dictConvert('PayStatus',row.payStatus) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="syncPayMode" title="是否是异步支付">
        <template v-slot="{row}">
          {{ row.syncPayMode?'是':'否' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="syncPayTypeCode" title="异步支付方式">
        <template v-slot="{row}">
          {{ dictConvert('PayChannel', row.syncPayTypeCode) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="description" title="描述"/>
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template v-slot:overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="sync(row)">刷新信息</a>
                </a-menu-item>
                <a-menu-item v-if="[0].includes(row.payStatus)">
                  <a @click="pay(row)">支付</a>
                </a-menu-item>
                <a-menu-item v-if="[0].includes(row.payStatus)">
                  <a-popconfirm
                    title="是否关闭支付"
                    @confirm="cancel(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:" style="color: red">关闭</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item v-if="[1].includes(row.payStatus)">
                  <a-popconfirm
                    title="是否发起退款"
                    @confirm="refund(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:" style="color: red">退款</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
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
    <payment-info ref="paymentInfo"/>
  </a-card>
</template>

<script>
import { page } from '@/api/payment/payment.js'
import PaymentInfo from './PaymentInfo'
import { TableMixin } from '@/mixins/TableMixin'
import { cancelByPaymentId, refundByBusinessId, syncByBusinessId } from '@/api/payment/pay'
export default {
  name: 'PaymentList',
  components: {
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
      this.$refs.paymentInfo.init(record.id, 'show')
    },
    // 同步信息
    sync (record) {
      syncByBusinessId(record.businessId).then(_ => {
        this.init()
      })
    },
    // 发起支付
    pay (record) {

    },
    // 关闭支付
    cancel (record) {
      cancelByPaymentId(record.id).then(_ => {
        this.init()
      })
    },
    // 退款
    refund (record) {
      refundByBusinessId(record.businessId).then(_ => {
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
