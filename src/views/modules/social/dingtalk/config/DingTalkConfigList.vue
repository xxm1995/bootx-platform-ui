<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="请输入钉钉配置名称" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="AppKey">
              <a-input v-model="queryParam.appKey" placeholder="请输入钉钉AppKey" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-space>
              <a-button type="primary" @click="query">查询</a-button>
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
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称"/>
      <vxe-table-column field="appKey" title="AppKey"/>
      <vxe-table-column field="appSecret" title="AppSecret"/>
      <vxe-table-column field="enable" title="是否启用">
        <template v-slot="{row}">
          <a-tag> {{ row.enable?'启用':'未启用' }} </a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注"/>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="170" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template v-slot:overlay>
              <a-menu>
                <a-menu-item>
                  <a v-if="!row.enable" @click="()=>setEnable(row)">启用</a>
                  <a v-else @click="()=>clearEnable(row)">停用</a>
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
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange"/>
    <ding-talk-config-edit
      ref="dingTalkConfigEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import DingTalkConfigEdit from './DingTalkConfigEdit'
import { page, del, setEnable, clearEnable } from '@/api/social/dingTalkConfig'

export default {
  name: 'DingTalkConfigList',
  mixins: [TableMixin],
  components: {
    DingTalkConfigEdit
  },
  data () {
    return {
      queryParam: {
        name: '',
        appKey: ''
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
      this.$refs.dingTalkConfigEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.dingTalkConfigEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dingTalkConfigEdit.init(record.id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    setEnable (record) {
      setEnable(record.id).then(_ => {
        this.init()
      })
    },
    clearEnable (record) {
      clearEnable(record.id).then(_ => {
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
