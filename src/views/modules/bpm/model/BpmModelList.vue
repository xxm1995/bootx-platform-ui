<template>
  <a-card :bordered="false">
    <b-query
      query-param="queryParam"
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
      <template #buttons>
        <a-button type="primary" icon="plus" @click="add">新建</a-button>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-column type="seq" title="序号" width="60" />
      <vxe-column field="name" title="名称" />
      <vxe-column field="modelType" title="流程类型" />
      <vxe-column field="defName" title="流程名称" />
      <vxe-column field="defId" title="流程ID" />
      <vxe-column field="publish" title="发布状态">
        <template v-slot="{row}">
          <a-tag>{{ dictConvert('BpmModelPublish',row.publish) }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="mainProcess" title="是否主流程">
        <template v-slot="{row}">
          <a-tag v-if="row.mainProcess" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="processVersion" title="流程版本号">
        <template v-slot="{row}">
          <a-tag>{{ row.processVersion||'无' }}</a-tag>
        </template>
      </vxe-column>
      <vxe-column field="remark" title="备注" />
      <vxe-column field="createTime" title="创建时间" />
      <vxe-column fixed="right" width="320" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a :disabled="row.publish === PUBLISHED" href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="bpmnEdit(row,false)">设计流程</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="taskNodeShow(row)">节点配置</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:" @click="bpmnEdit(row,true)">查看流程</a>
                </a-menu-item>
                <a-menu-item>
                  <a :disabled="row.publish !== UNPUBLISHED" href="javascript:" @click="verifyModel(row)">校验模型</a>
                </a-menu-item>
                <a-menu-item>
                  <a :disabled="row.publish !== UNPUBLISHED" href="javascript:" @click="publish(row)">发布</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:" @click="copy(row)">复制</a>
                </a-menu-item>
                <a-menu-item>
                  <a :disabled="row.publish === PUBLISHED" href="javascript:" @click="remove(row)" :style="{color: row.publish === PUBLISHED?'':'red'}">删除</a>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </vxe-column>
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
    <bpm-model-edit ref="bpmModelEdit" @ok="init"/>
    <bpm-model-node-list ref="bpmModelNodeList"/>
    <bpm-modeler ref="bpmModeler"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { copy, del, page, publish, verifyModel } from '@/api/bpm/model'
import BpmModelEdit from './BpmModelEdit'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import BpmModelNodeList from './BpmModelNodeList'
import BpmModeler from './BpmModeler'

export default {
  name: 'BpmModelList',
  mixins: [TableMixin],
  components: { BpmModeler, BpmModelNodeList, BpmModelEdit },
  data () {
    return {
      // 流程定义已发布
      PUBLISHED: 'published',
      // 未发布
      UNPUBLISHED: 'unpublished',
      // 上传文件类型限定
      acceptType: '',
      fields: [
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入流程模型名称' }
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
      this.$refs.bpmModelEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.bpmModelEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.bpmModelEdit.init(record.id, 'show')
    },
    /**
     * 流程图设计
     */
    bpmnEdit (record, isView) {
      this.$refs.bpmModeler.init(record.id, isView)
    },
    /**
     * 任务节点列表
     */
    taskNodeShow (record, edit) {
      this.$refs.bpmModelNodeList.list(record, edit)
    },
    remove (record) {
      this.$confirm({
        title: '删除',
        content: '是否删除流程模型',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.loading = true
          del(record.id).then(_ => {
            this.$message.info('删除成功')
            this.init()
          })
        }
      })
    },
    /**
     * 发布
     */
    publish (record) {
      this.$confirm({
        title: '警告',
        content: '是否发布当前流程模型',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.loading = true
          publish(record.id).then(() => {
            this.$message.success('发布流程成功')
            this.init()
          })
        }
      })
    },
    /**
     * 复制
     */
    copy (record) {
      this.$confirm({
        title: '复制',
        content: '是否要复制该流程模型',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.loading = true
          copy(record.id).then(_ => {
            this.$message.success('复制成功')
            this.init()
          })
        }
      })
    },
    verifyModel (record) {
      verifyModel(record.id).then(_ => {
        this.$message.success('校验通过')
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
