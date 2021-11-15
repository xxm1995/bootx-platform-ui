<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col v-action:add :md="8" :sm="24">
            <a-form-item label="终端代码">
              <a-input v-model="queryParam.code" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col v-action:_GHOST :md="8" :sm="24">
            <a-form-item label="终端名称">
              <a-input v-model="queryParam.name" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => this.queryParam = {}">重置</a-button>
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
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      resizable
      border
      stripe
      show-overflow
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column v-if="$auth('123')" field="code" title="代码" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="captcha" title="启用验证码" >
        <template v-slot="{row}">
          <a-tag v-if="row.captcha" color="green">开启</a-tag>
          <a-tag v-else color="red">关闭</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="enable" title="启用状态" >
        <template v-slot="{row}">
          <a-tag v-if="row.enable" color="green">启用</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="timeout" title="超时时间(分钟)" />
      <vxe-table-column field="description" title="描述" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="150" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <a-popconfirm
            title="是否删除终端"
            @confirm="remove(row)"
            okText="是"
            cancelText="否">
            <a href="javascript:" style="color: red">删除</a>
          </a-popconfirm>
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
      />
    </vxe-pager>
    <client-edit
      ref="clientEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { page, del } from '@/api/system/client'
import ClientEdit from './ClientEdit'
import { TableMixin } from '@/mixins/TableMixin'
export default {
  name: 'ClientList',
  components: {
    ClientEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
        code: '',
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
    add () {
      this.$refs.clientEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.clientEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.clientEdit.init(record.id, 'show')
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
