<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
    </div>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
    </vxe-toolbar>
    <vxe-table
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData">
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="userId" title="用户ID"/>
      <vxe-table-column field="weChatId" title="微信">
        <template v-slot="{row}">
          <a-tag color="green" v-show="row.weChatId !== null">已绑定</a-tag>
          <a-tag color="red" v-show="row.weChatId === null">未绑定</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="weComId" title="企业微信" >
        <template v-slot="{row}">
          <a-tag color="green" v-show="row.weComId !== null">已绑定</a-tag>
          <a-tag color="red" v-show="row.weComId === null">未绑定</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="qqId" title="QQ" >
        <template v-slot="{row}">
          <a-tag color="green" v-show="row.qqId !== null">已绑定</a-tag>
          <a-tag color="red" v-show="row.qqId === null">未绑定</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="dingTalkId" title="钉钉" >
        <template v-slot="{row}">
          <a-tag color="green" v-show="row.dingTalkId !== null">已绑定</a-tag>
          <a-tag color="red" v-show="row.dingTalkId === null">未绑定</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="weiboId" title="微博" >
        <template v-slot="{row}">
          <a-tag color="green" v-show="row.weiboId !== null">已绑定</a-tag>
          <a-tag color="red" v-show="row.weiboId === null">未绑定</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="giteeId" title="码云" >
        <template v-slot="{row}">
          <a-tag color="green" v-show="row.giteeId !== null">已绑定</a-tag>
          <a-tag color="red" v-show="row.giteeId === null">未绑定</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column fixed="right" width="120" :showOverflow="false" title="操作">
        <template slot-scope="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">操作</a>
          <a-divider type="vertical"/>
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
      :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
      @page-change="handleTableChange">
    </vxe-pager>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { page } from '@/api/system/social'

export default {
  name: 'SocialList',
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        account: '',
        name: ''
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
        this.tableData = res.data.records
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    show (record) {

    },
    edit (record) {

    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
