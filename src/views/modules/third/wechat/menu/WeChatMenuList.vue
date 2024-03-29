<template>
  <a-card :bordered="false">
    <b-query
      :query-param="queryParam"
      :default-item-md="8"
      :disabled-query="superQueryFlag"
      :fields="fields"
      @query="query"
      @reset="() => queryParam = {}"/>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-space>
          <a-button type="primary" icon="plus" @click="add">新建</a-button>
          <a-tooltip title="获取微信当前菜单配置到系统中">
            <a-button icon="sync" @click="importMenu">导入</a-button>
          </a-tooltip>
          <a-tooltip title="清空当前微信的菜单配置">
            <a-button type="danger" icon="delete" @click="clearMenu">清空</a-button>
          </a-tooltip>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="名称"/>
      <vxe-column field="publish" title="启用状态">
        <template v-slot="{row}">
          <a-tag v-if="row.publish" color="green">已发布</a-tag>
          <a-tag v-else color="red">草稿</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注"/>
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="220" :showOverflow="false" title="操作">
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
      </vxe-column>
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
import { page, del, importMenu, publish, clearMenu } from '@/api/third/weChatMenu'
import WeChatMenuEdit from './WeChatMenuEdit'
import WeChatMenuDesign from './WeChatMenuDesign'
import { TableMixin } from '@/mixins/TableMixin'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
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
      },
      fields: [
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入名称' }
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
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          importMenu().then(() => {
            this.$message.success('导入成功')
            this.init()
          })
        }
      })
    },
    /**
     * 清空微信的菜单
     */
    clearMenu () {
      this.$confirm({
        title: '警告',
        content: '是否清除当前微信配置的自定义菜单',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          clearMenu().then(() => {
            this.$message.success('清除成功')
          })
        }
      })
    },
    /**
     * 发布
     */
    publish (record) {
      this.$confirm({
        title: '通知',
        content: '是否将当前微信自定义菜单进行发布',
        okText: '确定',
        cancelText: '取消',
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
