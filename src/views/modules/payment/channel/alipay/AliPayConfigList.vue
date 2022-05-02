<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model :model="queryParam" layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="名称" prop="jobClassName">
              <a-input placeholder="请输入名称" v-model="queryParam.name"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="AppId" prop="appId">
              <a-input placeholder="请输入AppId" v-model="queryParam.appId"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称"/>
      <vxe-table-column field="appId" title="商户appId">
      </vxe-table-column>
      <vxe-table-column field="authType" title="认证方式" >
        <template v-slot="{row}">
          <a-tag v-show="row.authType === 1">公钥</a-tag>
          <a-tag v-show="row.authType === 2">证书</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="signType" title="签名类型" >
      </vxe-table-column>
      <vxe-table-column field="sandbox" title="沙箱" >
        <template v-slot="{row}">
          <a-tag v-if="row.sandbox">是</a-tag>
          <a-tag v-else>否</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="activity" title="活动状态" >
        <template v-slot="{row}">
          <a-tag color="green" v-if="row.activity">启用</a-tag>
          <a-tag color="red" v-else>未启用</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column fixed="right" width="170" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template v-slot:overlay>
              <a-menu>
                <a-menu-item>
                  <a v-if="!row.activity" @click="()=>setUpActivity(row)">启用</a>
                  <a v-else @click="()=>clearActivity(row)">停用</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否删除该配置"
                    @confirm="remove(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:" style="color: red">删除</a>
                  </a-popconfirm>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </vxe-table-column>
    </vxe-table>
    <vxe-pager
      border
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
    </vxe-pager>
    <ali-pay-config-edit
      ref="aliPayConfigEdit"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import AliPayConfigEdit from './AliPayConfigEdit'
import { page, del, setUpActivity, clearActivity } from '@/api/payment/alipayConfig'

export default {
  name: 'AliPayConfigList',
  mixins: [TableMixin],
  components: {
    AliPayConfigEdit
  },
  data () {
    return {
      queryParam: {
        name: '',
        appId: ''
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
    add () {
      this.$refs.aliPayConfigEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.aliPayConfigEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.aliPayConfigEdit.init(record.id, 'show')
    },
    itemList (record) {
      this.$refs.aliPayConfigEdit.init(record)
    },
    remove (record) {
      del(record.id).then(() => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    setUpActivity (record) {
      setUpActivity(record.id).then(() => {
        this.init()
      })
    },
    clearActivity (record) {
      clearActivity(record.id).then(() => {
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
