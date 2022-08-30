<template>
  <a-drawer
    :visible="visible"
    :title="title"
    :maskClosable="true"
    :width="1000"
    placement="right"
    :closable="true"
    @close="handleCancel"
  >
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template v-slot:buttons>
        <a-space>
          <a-button type="primary" icon="plus" @click="add">添加</a-button>
          <a-button icon="sync" :disabled="loading" @click="sync">同步任务节点</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="taskName" title="任务节点名称"/>
      <vxe-table-column field="taskId" title="任务节点id"/>
      <vxe-table-column field="assignType" title="人员分配类型">
        <template v-slot="{row}">
          {{ dictConvert('BpmTaskAssignType',row.assignType) }}
        </template>
      </vxe-table-column>
      <vxe-table-column fixed="right" width="200" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="remove(row)" style="color: red">删除</a>
        </template>
      </vxe-table-column>
    </vxe-table>
    <bpm-model-task-edit
      ref="bpmModelTaskEdit"
      @ok="handleOk"/>
  </a-drawer>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { listByModelId, del, sync } from '@/api/bpm/modelTask'
import BpmModelTaskEdit from './BpmModelTaskEdit'
import { copy } from '@/api/bpm/model'

export default {
  name: 'BpmModelTaskList',
  mixins: [TableMixin],
  components: {
    BpmModelTaskEdit
  },
  data () {
    return {
      title: '',
      isEdit: true,
      visible: false,
      modelId: null
    }
  },
  methods: {
    /**
     * 展示列表
     */
    list (record, edit) {
      this.isEdit = edit
      this.modelId = record.id
      this.title = record.name
      this.visible = true
      this.init()
    },
    init () {
      this.loading = true
      listByModelId(this.modelId).then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    handleCancel () {
      this.visible = false
    },
    add () {
      this.$refs.bpmModelTaskEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.bpmModelTaskEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.bpmModelTaskEdit.init(record.id, 'show')
    },
    remove (record) {
      this.$confirm({
        title: '删除',
        content: '是否删除流程模型',
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
     * 同步任务节点
     */
    sync () {
      this.$confirm({
        title: '同步',
        content: '是否同步流程业务节点',
        onOk: () => {
          this.loading = true
          sync(this.modelId).then(() => {
            this.$message.success('同步任务节点成功')
            this.init()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
