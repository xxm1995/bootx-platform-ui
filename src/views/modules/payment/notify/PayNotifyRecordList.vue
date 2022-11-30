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
      <vxe-column field="paymentId" title="支付号" />
      <vxe-column field="payChannel" title="支付通道">
        <template v-slot="{row}">
          {{ dictConvert('PayChannel',row.payChannel) }}
        </template>
      </vxe-column>
      <vxe-column field="status" title="处理状态">
        <template v-slot="{row}">
          {{ dictConvert('PayNotifyProcess',row.status) }}
        </template>
      </vxe-column>
      <vxe-column field="msg" title="提示信息" />
      <vxe-column field="notifyTime" title="通知时间" />
      <vxe-column fixed="right" width="70" :showOverflow="false" title="操作">
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
      @page-change="handleTableChange">
    </vxe-pager>
    <pay-notify-record-edit
      ref="payNotifyRecordEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { page, del } from '@/api/payment/payNotifyRecord'
import PayNotifyRecordEdit from './PayNotifyRecordInfo'
import { TableMixin } from '@/mixins/TableMixin'
import { LIST, STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'PayNotifyRecordList',
  components: {
    PayNotifyRecordEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      asyncPayChannel: [],
      payNotifyProcess: [],
      queryParam: {
        paymentId: '',
        payChannel: undefined,
        status: undefined
      }
    }
  },
  computed: {
    fields () {
      return [
        { field: 'paymentId', type: STRING, name: '支付单号', placeholder: '请输入支付单号' },
        {
          field: 'payChannel',
          type: LIST,
          name: '支付通道',
          placeholder: '请选择支付通道',
          list: this.asyncPayChannel
        },
        {
          field: 'status',
          type: LIST,
          name: '处理状态',
          placeholder: '请选择消息处理状态',
          list: this.payNotifyProcess
        }
      ]
    }

  },
  methods: {
    init () {
      this.loading = true
      // 异步支付方式
      this.getDictDropDownAsync('AsyncPayChannel').then(res => {
        this.asyncPayChannel = res
      })
      // 回调状态
      this.getDictDropDownAsync('PayNotifyProcess').then(res => {
        this.payNotifyProcess = res
      })
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    show (record) {
      this.$refs.payNotifyRecordEdit.init(record.id, 'show')
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
