<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" >
      <a-form layout="inline">
        <a-row :gutter="48">
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
      <a-button type="primary" icon="plus" @click="add">开通钱包</a-button>
    </vxe-toolbar>
    <vxe-table
      ref="table"
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="userId" title="用户ID"/>
      <vxe-table-column field="id" title="钱包ID"/>
      <vxe-table-column field="balance" title="余额"/>
      <vxe-table-column field="payStatus" title="状态">
        <template v-slot="{row}">
          {{ dictConvert('WalletStatus',row.status) }}
        </template>
      </vxe-table-column>
      <vxe-table-column field="createTime" title="创建时间"/>
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
                  <a v-if="row.status === 1 " @click="lockConfirm(row.id,true)">锁定钱包</a>
                  <a v-if="row.status === 2 " @click="lockConfirm(row.id,false)">解锁钱包</a>
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
    <wallet-info ref="walletInfo"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { lock, page, unlock } from '@/api/payment/wallet'
import WalletInfo from './WalletInfo'

export default {
  name: 'WalletList',
  mixins: [TableMixin],
  components: {
    WalletInfo
  },
  data () {
    return {
      queryParam: {
        paymentId: '',
        businessId: '',
        title: ''
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
      this.$refs.walletInfo.init(record.id, 'show')
    },
    // 开通钱包
    add () {

    },
    // 钱包日志
    showLog () {

    },
    /**
     * 禁用钱包
     * @param walletId 钱包id
     * @param type true 锁定, false 解锁
     */
    lockConfirm (walletId, type) {
      const that = this
      this.$confirm({
        title: type ? '是否锁定该钱包' : '是否解锁该钱包',
        onOk: async () => {
          if (type) {
            await lock(walletId)
          } else {
            await unlock(walletId)
          }
          that.init()
        }
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
