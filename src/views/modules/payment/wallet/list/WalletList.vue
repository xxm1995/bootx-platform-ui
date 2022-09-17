<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" >
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="钱包ID">
              <a-input v-model="queryParam.walletId" placeholder="请输入钱包ID" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="用户ID">
              <a-input v-model="queryParam.userId" placeholder="请输入用户ID" />
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
        <a-button type="primary" icon="usergroup-add" @click="add">开通钱包</a-button>
      </template>
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
    <wallet-log-list ref="walletLogList"/>
    <user-select-modal ref="userSelectModal" @ok="createWalletBatch"/>
    <wallet-changer ref="walletChanger" @ok="init"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { createWalletBatch, lock, page, unlock } from '@/api/payment/wallet'
import WalletInfo from './WalletInfo'
import UserSelectModal from './UserSelectModal'
import WalletChanger from './WalletChanger'
import WalletLogList from './WalletLogList'

export default {
  name: 'WalletList',
  mixins: [TableMixin],
  components: {
    WalletLogList,
    WalletInfo,
    UserSelectModal,
    WalletChanger
  },
  data () {
    return {
      queryParam: {
        walletId: '',
        userId: ''
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
     * 禁用钱包
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
