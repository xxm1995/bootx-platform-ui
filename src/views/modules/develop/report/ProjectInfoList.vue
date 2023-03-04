<template>
  <a-card :bordered="false">
    <b-query
      v-model="queryParam"
      :fields="fields"
      :default-item-md="8"
      @query="query"
      @reset="() => queryParam = {}"
    />
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
      <vxe-column type="seq" width="60" />
      <vxe-column field="id" title="大屏代码" />
      <vxe-column field="name" title="项目名称" />
      <vxe-column field="state" title="发布状态">
        <template #default="{ row }">
          <a-tag v-if="row.state === 1" color="green">已发布</a-tag>
          <a-tag v-else color="red">未发布</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="edit" title="编辑状态">
        <template #default="{ row }">
          <a-tag v-if="row.edit" color="red">编辑中</a-tag>
          <a-tag v-else color="green">未编辑</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="220" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical" />
          <span>
            <a href="javascript:" @click="design(row)">设计</a>
          </span>
          <a-divider type="vertical" />
          <span>
            <a href="javascript:" @click="preview(row)">预览</a>
          </span>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:" @click="copyInfo(row)">复制</a>
                </a-menu-item>
                <a-menu-item v-if="row.edit">
                  <a href="javascript:" @click="enableEdit(row)">保存编辑</a>
                </a-menu-item>
                <a-menu-item v-if="row.edit">
                  <a href="javascript:" @click="resetEdit(row)">重置编辑</a>
                </a-menu-item>
                <a-menu-item v-if="row.state === -1">
                  <a href="javascript:" @click="publishInfo(row)">发布</a>
                </a-menu-item>
                <a-menu-item v-if="row.state === 1">
                  <a href="javascript:" @click="unPublishInfo(row)">取消发布</a>
                </a-menu-item>
                <a-menu-item :disabled="row.state === 1">
                  <a href="javascript:" :style="{color: row.state === 1?'rgba(0, 0, 0, 0.25)':'red'}" :disabled="row.state === 1" @click="remove(row)">删除</a>
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
    <project-info-edit
      ref="projectInfoEdit"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import {
  page,
  del,
  getGoViewUrl,
  copy,
  publish,
  unPublish,
  enableEditContent,
  resetEditContent
} from '@/api/develop/projectInfo'
import ProjectInfoEdit from './ProjectInfoEdit'
import { TableMixin } from '@/mixins/TableMixin'
export default {
  name: 'ProjectInfoList',
  components: {
    ProjectInfoEdit
  },
  mixins: [TableMixin],
  data () {
    return {
      goViewUrl: '',
      fields: [
        { field: 'projectId', name: '大屏代码', placeholder: '请输入大屏代码' },
        { field: 'name', name: '项目名称', placeholder: '请输入项目名称' }
      ]
    }
  },
  methods: {
    // 初始化GoView地址
    initGoViewUrl () {
      getGoViewUrl().then(({ data }) => {
        this.goViewUrl = data
      })
    },
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
      this.$refs.projectInfoEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.projectInfoEdit.init(record.id, 'edit')
    },
    // 预览
    preview (record) {
      open(`${this.goViewUrl}/#/chart/preview/${record.id}`, '_blank')
    },
    // 设计
    design (record) {
      open(`${this.goViewUrl}/#/chart/home/${record.id}`, '_blank')
    },
    // 复制
    copyInfo (record) {
      this.$confirm({
        title: '复制',
        content: '是否复制大屏?',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.loading = true
          copy(record.id).then(_ => {
            this.$message.info('复制成功')
            this.init()
          })
        }
      })
    },
    // 发布
    publishInfo (record) {
      this.$confirm({
        title: '发布',
        content: '是否发布大屏?',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.loading = true
          publish(record.id).then(_ => {
            this.$message.info('发布成功')
            this.init()
          })
        }
      })
    },
    // 取消发布
    unPublishInfo (record) {
      this.$confirm({
        title: '取消发布',
        content: '是否取消发布大屏?',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.loading = true
          unPublish(record.id).then(_ => {
            this.$message.info('取消发布成功')
            this.init()
          })
        }
      })
    },
    // 应用编辑中的信息
    enableEdit (record) {
      this.$confirm({
        title: '保存编辑',
        content: '是否保存编辑中的信息，保存后发布的数据将会更新',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.loading = true
          enableEditContent(record.id).then(_ => {
            this.$message.info('更新成功')
            this.init()
          })
        }
      })
    },
    // 重置编辑中的信息
    resetEdit (record) {
      this.$confirm({
        title: '重置编辑',
        content: '是否重置编辑中的信息，确定后编辑的内容将会恢复为之前保存的内容',
        okText: '是',
        cancelText: '否',
        onOk: () => {
          this.loading = true
          resetEditContent(record.id).then(_ => {
            this.$message.info('重置成功')
            this.init()
          })
        }
      })
    },
    // 删除
    remove (record) {
      this.$confirm({
        title: '警告',
        content: '是否删除大屏?',
        okText: '是',
        okType: 'danger',
        cancelText: '否',
        onOk: () => {
          del(record.id).then(_ => {
            this.$message.info('删除成功')
            this.init()
          })
        }
      })
    }
  },
  created () {
    this.initGoViewUrl()
    this.init()
  }
}
</script>

<style scoped>

</style>
