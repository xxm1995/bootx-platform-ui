<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="支付单号">
              <a-input v-model="queryParam.paymentId" placeholder="请输入支付单号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="支付通道">
              <a-select
                allowClear
                v-model="queryParam.payChannel"
                placeholder="选择支付通道"
                :options="asyncPayChannel"
              >
              </a-select>
            </a-form-item>
          </a-col><a-col :md="6" :sm="24">
            <a-form-item label="处理状态">
              <a-select
                allowClear
                v-model="queryParam.status"
                placeholder="选择消息处理状态"
                :options="payNotifyProcess"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
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
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="paymentId" title="支付号" />
      <vxe-table-column field="notifyInfo" title="通知消息" />
      <vxe-table-column field="payChannel" title="支付通道">
        <template v-slot="{row}">
          {{ dictConvert('PayChannel',row.payChannel) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="处理状态">
        <template v-slot="{row}">
          {{ dictConvert('PayNotifyProcess',row.status) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="msg" title="提示信息" />
      <vxe-table-column field="notifyTime" title="通知时间" />
      <vxe-table-column fixed="right" width="70" :showOverflow="false" title="操作">
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
      @page-change="handleTableChange">
      />
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
