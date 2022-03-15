<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper" >
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="卡号">
              <a-input v-model="queryParam.cardNo" placeholder="请输入储值卡卡号" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="批次号">
              <a-input v-model="queryParam.batchNo" placeholder="请输入批次号" />
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
      <template v-slot:buttons>
        <a-space>
          <a-button type="primary" @click="generationBatch">生成储值卡</a-button>
          <a-button @click="importBatch">导入储值卡</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      ref="table"
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="cardNo" title="卡号"/>
      <vxe-table-column field="batchNo" title="生成批次号"/>
      <vxe-table-column field="faceValue" title="面值"/>
      <vxe-table-column field="balance" title="余额"/>
      <vxe-table-column field="startTime" title="开始时间"/>
      <vxe-table-column field="endTime" title="结束时间"/>
      <vxe-table-column field="enduring" title="长期有效">
        <template v-slot="{row}">
          <a-tag>{{ row.enduring?'长期':'期限' }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="status" title="状态">
        <template v-slot="{row}">
          {{ dictConvert('VoucherStatus',row.status) }}
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
                  <a v-if="row.status === 1 " @click="lockConfirm(row.id,true)">停用</a>
                  <a v-if="row.status === 2 " @click="lockConfirm(row.id,false)">启用</a>
                </a-menu-item>
                <a-menu-item>
                  <a>金额变动</a>
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
    <voucher-generation ref="voucherGeneration" @ok="init"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { lock, page, unlock } from '@/api/payment/voucher'
import VoucherGeneration from './VoucherGeneration'

export default {
  name: 'VoucherList',
  mixins: [TableMixin],
  components: {
    VoucherGeneration
  },
  data () {
    return {
      queryParam: {
        cardNo: '',
        batchNo: ''
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
    },
    // 批量生成
    generationBatch () {
      this.$refs.voucherGeneration.init()
    },
    // 批量导入
    importBatch () {

    },
    /**
     * 启用/停用 储值卡
     * @param voucherId 储值卡id
     * @param type true 锁定, false 解锁
     */
    lockConfirm (voucherId, type) {
      const that = this
      this.$confirm({
        title: type ? '是否停用该储值卡' : '是否启用该储值卡',
        onOk: async () => {
          if (type) {
            await lock(voucherId)
          } else {
            await unlock(voucherId)
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
