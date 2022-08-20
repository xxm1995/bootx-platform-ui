<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" >
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="支付单号">
              <a-input v-model="queryParam.paymentId" placeholder="请输入支付单号" />
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
              <a-button :disabled="superQueryFlag" type="primary" @click="query">查询</a-button>
              <a-button @click="resetQuery">重置</a-button>
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
        <b-super-query
          :queryState="superQueryFlag"
          :fields="queryFields"
          :width="880"
          button-title="超级查询器"
          model-title="超级查询器"
          @query="changeSuperQuery"
          @reset="resetQuery"
        />
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="table"
      row-id="id"
      :sort-config="{remote:true,trigger:'cell',defaultSort:{field:'createTime',order:'desc'}}"
      @sort-change="sortChange"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="businessId" title="业务ID"/>
      <vxe-table-column field="title" title="标题"/>
      <vxe-table-column field="amount" title="金额" sortable/>
      <vxe-table-column field="refundableBalance" title="可退余额" sortable/>
      <vxe-table-column field="payStatus" title="支付状态" sortable>
        <template v-slot="{row}">
          {{ dictConvert('PayStatus',row.payStatus) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="asyncPayMode" title="是否是异步支付">
        <template v-slot="{row}">
          {{ row.asyncPayMode?'是':'否' }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="asyncPayChannel" title="异步支付方式">
        <template v-slot="{row}">
          {{ dictConvert('PayChannel', row.asyncPayChannel) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间" sortable/>
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
            <template #overlay>
              <a-menu>
                <a-menu-item v-if="row.asyncPayMode">
                  <a @click="sync(row)">刷新信息</a>
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
                <a-menu-item v-if="[1,4].includes(row.payStatus) && row.refundableBalance > 0">
                  <a href="javascript:" @click="refund(row)" style="color: red">退款</a>
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
    <refund-model ref="refundModel" @ok="init"/>
  </a-card>
</template>

<script>
import { page, superPage } from '@/api/payment/payment.js'
import PaymentInfo from './PaymentInfo'
import RefundModel from './RefundModel'
import { TableMixin } from '@/mixins/TableMixin'
import { cancelByPaymentId, syncByBusinessId } from '@/api/payment/pay'
import { BOOLEAN, DATE_TIME, LIST, NUMBER, STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'PaymentList',
  components: {
    PaymentInfo,
    RefundModel
  },
  mixins: [TableMixin],
  data () {
    return {
      syncPayChannelList: [],
      payStatusList: [],
      superQueryParam: [],
      sortParam: {
        sortField: 'createTime',
        asc: false
      },
      queryParam: {
        paymentId: '',
        businessId: '',
        title: ''
      }
    }
  },
  computed: {
    // 超级查询字段
    queryFields () {
      return [
        { field: 'id', name: '支付ID', type: STRING },
        { field: 'businessId', name: '业务ID', type: STRING },
        { field: 'userId', name: '用户ID', type: STRING },
        { field: 'title', name: '标题', type: STRING },
        { field: 'amount', name: '金额', type: NUMBER, precision: 2 },
        { field: 'errorCode', name: '错误码', type: STRING },
        { field: 'asyncPayMode', name: '异步支付', type: BOOLEAN },
        { field: 'asyncPayChannel', name: '异步支付方式', type: LIST, list: this.syncPayChannelList },
        { field: 'payTime', name: '支付时间', type: DATE_TIME },
        { field: 'payStatus', name: '支付状态', type: LIST, list: this.payStatusList }
      ]
    }
  },
  methods: {
    // 初始化查询数据
    initData () {
      this.getDictDropDownAsync('PayStatus').then(res => {
        this.payStatusList = res
      })
      this.getDictDropDownAsync('PayChannel').then(res => {
        this.syncPayChannelList = res
      })
    },
    // 初始化
    init () {
      if (this.superQueryFlag) {
        this.superQuery()
      } else { this.queryPage() }
    },
    // 普通查询
    queryPage () {
      this.superQueryFlag = false
      this.loading = true
      page({
        ...this.queryParam,
        ...this.pages,
        ...this.sortParam
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    // 同步信息
    sync (record) {
      syncByBusinessId(record.businessId).then(_ => {
        this.init()
      })
    },
    // 关闭支付
    cancel (record) {
      cancelByPaymentId(record.id).then(_ => {
        this.init()
      })
    },
    // 查看信息
    show (record) {
      this.$refs.paymentInfo.init(record.id)
    },
    // 退款
    refund (record) {
      this.$refs.refundModel.init(record.id)
    },
    // 排序条件变动
    sortChange ({ order, property }) {
      this.sortParam.sortField = order ? property : null
      this.sortParam.asc = order === 'asc'
      this.init()
    },
    // 超级查询条件变动
    changeSuperQuery (queryParams) {
      this.superQueryParam = queryParams
      this.superQuery()
    },
    // 超级查询
    superQuery () {
      this.superQueryFlag = true
      this.loading = true
      superPage(
        this.pages, {
          queryParams: this.superQueryParam,
          queryOrders: [this.sortParam]
        }
      ).then(res => {
        this.pageQueryResHandel(res, this)
      })
    }
  },
  created () {
    this.initData()
    this.init()
  }
}
</script>

<style scoped>

</style>
