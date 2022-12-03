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
      <template #buttons>
        <a-button type="primary" icon="usergroup-add" @click="add">开通钱包</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="table"
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="userId" title="用户ID"/>
      <vxe-column field="id" title="钱包ID"/>
      <vxe-column field="balance" title="余额"/>
      <vxe-column field="payStatus" title="状态">
        <template v-slot="{row}">
          {{ dictConvert('WalletStatus',row.status) }}
        </template>
      </vxe-column>
      <vxe-column field="createTime" title="创建时间"/>
      <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
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
                <a-menu-item>
                  <a @click="showLog(row.id)">钱包日志</a>
                </a-menu-item>
                <a-menu-item>
                  <a v-if="row.status === 1 " @click="lockConfirm(row.id,true)">锁定钱包</a>
                  <a v-if="row.status === 2 " @click="lockConfirm(row.id,false)">解锁钱包</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="recharge(row.id)">金额变动</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
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
    <wallet-info ref="walletInfo"/>
    <wallet-log-list ref="walletLogList"/>
    <b-user-select-modal ref="userSelectModal" :data-source="pageByNotWallet" @ok="createWalletBatch"/>
    <wallet-changer ref="walletChanger" @ok="init"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { createWalletBatch, lock, page, pageByNotWallet, unlock } from '@/api/payment/wallet'
import WalletInfo from './WalletInfo'
import BUserSelectModal from '@/components/Bootx/UserSelectModal/BUserSelectModal'
import WalletChanger from './WalletChanger'
import WalletLogList from './WalletLogList'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

export default {
  name: 'WalletList',
  mixins: [TableMixin],
  components: {
    WalletLogList,
    WalletInfo,
    BUserSelectModal,
    WalletChanger
  },
  data () {
    return {
      queryParam: {
        walletId: '',
        userId: ''
      },
      fields: [
        { field: 'walletId', type: STRING, name: '钱包ID', placeholder: '请输入钱包ID' },
        { field: 'userId', type: STRING, name: '用户ID', placeholder: '请输入用户ID' }
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
    // 查询为未开通钱包的用户
    pageByNotWallet (params) {
      return pageByNotWallet(params)
    },
    // 查看详情
    show (record) {
      this.$refs.walletInfo.init(record.id, 'show')
    },
    // 开通钱包窗口
    add () {
      this.$refs.userSelectModal.init()
    },
    // 批量开通钱包
    createWalletBatch (userIds) {
      this.loading = true
      this.$message.info('批量开通钱包中')
      createWalletBatch(userIds).then(() => this.init())
    },
    // 钱包日志
    showLog (walletId) {
      this.$refs.walletLogList.list(walletId)
    },
    // 调整余额
    recharge (walletId) {
      this.$refs.walletChanger.init(walletId)
    },
    /**
     * 锁定/解锁 钱包
     * @param walletId 钱包id
     * @param type true 锁定, false 解锁
     */
    lockConfirm (walletId, type) {
      const that = this
      this.$confirm({
        title: type ? '是否锁定该钱包' : '是否解锁该钱包',
        okText: '确定',
        cancelText: '取消',
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
