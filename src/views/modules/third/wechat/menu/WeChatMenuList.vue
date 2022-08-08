<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="6" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" placeholder="请输入名称"/>
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
        <a-space>
          <a-button type="primary" icon="plus" @click="add">新建</a-button>
          <a-button icon="sync" @click="importMenu">导入当前菜单</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称"/>
      <vxe-table-column field="publish" title="启用状态">
        <template v-slot="{row}">
          <a-tag v-if="row.publish" color="green">已发布</a-tag>
          <a-tag v-else color="red">草稿</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注"/>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="220" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="designEdit(row)">设计</a>
          </span>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a @click="designShow(row)">菜单预览</a>
                </a-menu-item>
                <a-menu-item>
                  <a @click="publish(row)">菜单发布</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否删除"
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
    <we-chat-menu-edit ref="weChatMenuEdit" @ok="handleOk"/>
    <we-chat-menu-design ref="weChatMenuDesign"/>
  </a-card>
</template>

<script>
import { page, del, importMenu, publish } from '@/api/third/weChatMenu'
import WeChatMenuEdit from './WeChatMenuEdit'
import { TableMixin } from '@/mixins/TableMixin'
import WeChatMenuDesign from '@/views/modules/third/wechat/menu/WeChatMenuDesign'
export default {
  name: 'WeChatMenuList',
  components: {
    WeChatMenuDesign,
    WeChatMenuEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      queryParam: {
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
        this.pageQueryResHandel(res, this)
      })
    },
    add () {
      this.$refs.weChatMenuEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.weChatMenuEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.weChatMenuEdit.init(record.id, 'show')
    },
    designEdit (record) {
      this.$refs.weChatMenuDesign.init(record.id, 'edit')
    },
    designShow (record) {
      this.$refs.weChatMenuDesign.init(record.id, 'show')
    },
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    /**
     * 导入菜单
     */
    importMenu () {
      this.$confirm({
        title: '通知',
        content: '是否导入当前微信自定义菜单到系统中',
        onOk: () => {
          importMenu().then(() => {
            this.$message.success('导入成功')
            this.init()
          })
        }
      })
    },
    publish (record) {
      this.$confirm({
        title: '通知',
        content: '是否将当前微信自定义菜单进行发布',
        onOk: () => {
          publish(record.id).then(() => {
            this.$message.success('菜单发布成功')
            this.init()
          })
        }
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
