<template>
  <a-drawer
    :visible="visible"
    title="字典列表"
    :maskClosable="true"
    :width="1000"
    placement="right"
    :closable="true"
    @close="handleCancel"
  >
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: queryPage}"
    />
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60"/>
      <vxe-column field="type" title="类型" >
        <template v-slot="{row}">
          {{ dictConvert('WalletLogType',row.type) }}
        </template>
      </vxe-column>
      <vxe-column field="amount" title="金额" />
      <vxe-column field="operationSource" title="操作类型" >
        <template v-slot="{row}">
          {{ dictConvert('WalletLogOperation',row.operationSource) }}
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" />
<!--      <vxe-column title="操作" fixed="right" width="120" :showOverflow="false">-->
<!--        <template v-slot="{row}">-->
<!--          <span>-->
<!--            <a href="javascript:" @click="show(row)">查看</a>-->
<!--          </span>-->
<!--        </template>-->
<!--      </vxe-column>-->
    </vxe-table>
    <vxe-pager
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
    </vxe-pager>
  </a-drawer>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { pageByWalletId } from '@/api/payment/walletLog'

export default {
  name: 'WalletLogList',
  mixins: [TableMixin],
  components: {
  },
  data () {
    return {
      visible: false,
      walletId: null,
      queryParam: {

      }
    }
  },
  methods: {
    // 展示列表
    list (walletId) {
      this.walletId = walletId
      this.init()
    },
    init () {
      this.visible = true
      this.queryPage()
    },
    queryPage () {
      this.loading = true
      pageByWalletId({
        ...this.pages,
        ...this.queryParam,
        walletId: this.walletId
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    show (record) {
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
