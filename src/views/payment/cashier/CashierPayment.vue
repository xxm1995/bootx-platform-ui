<template>
  <div class="paydemo-type-content" style="background-color: #ffffff">
    <div class="paydemo-type-name">
      <span>最新支付</span>
      <button
        class="layui-btn layui-btn-xs paydemo-btn"
        style="margin-top: 3px"
        @click="refreshOrder">刷新</button>
    </div>
    <a-table
      :columns="table.columns"
      :dataSource="table.data"
      :loading="table.loading"
      :rowKey="record => record.userId"
      :pagination="true"
    >
      <span #status="{text,record}">
        <a-tag color="blue" v-if="record.status==='1'">待支付</a-tag>
        <a-tag color="green" v-if="record.status==='2'">已支付</a-tag>
        <a-tag color="orange" v-if="record.status==='3'">已取消</a-tag>
      </span>
    </a-table>
  </div>
</template>

<script>
export default {
  name: 'CashierPayment',
  data () {
    return {
      table: {
        data: [
          {
            businessId: '001',
            money: '0.01',
            payChannel: '支付宝',
            payWay: '扫码支付',
            status: '3',
            createdTime: '2021-07-09 13:09:01'
          },
          {
            businessId: '002',
            money: '0.1',
            payChannel: '支付宝',
            payWay: '扫码支付',
            status: '1',
            createdTime: '2021-06-09 13:09:01'
          }, {
            businessId: '003',
            money: '10',
            payChannel: '微信',
            payWay: '付款码支付',
            status: '2',
            createdTime: '2021-05-09 13:09:01'
          }, {
            businessId: '004',
            money: '0.1',
            payChannel: '微信',
            payWay: '扫码支付',
            status: '3',
            createdTime: '2021-01-09 13:09:01'
          }, {
            businessId: '005',
            money: '1',
            payChannel: '支付宝',
            payWay: '付款码支付',
            status: '1',
            createdTime: '2021-04-09 13:09:01'
          }
        ],
        loading: false,
        columns: [
          {
            title: '业务编号',
            dataIndex: 'businessId'
          },
          {
            title: '支付金额',
            dataIndex: 'money'
          },
          {
            title: '支付渠道',
            dataIndex: 'payChannel'
          },
          {
            title: '支付方式',
            dataIndex: 'payWay'
          },
          {
            title: '支付状态',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '创建时间',
            dataIndex: 'createdTime'
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
