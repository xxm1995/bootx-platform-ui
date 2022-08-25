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
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="modelType" title="流程类型" />
      <vxe-table-column field="remark" title="备注" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="320" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="taskSetting(row)">流程配置</a>
          <a-divider type="vertical"/>
        </template>
      </vxe-table-column>
    </vxe-table>
  </a-drawer>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { itemPage } from '@/api/system/dict'

export default {
  name: 'BpmModelTaskList',
  mixins: [TableMixin],
  data () {
    return {
      title: '',
      visible: false,
      modelId: null
    }
  },
  methods: {
    /**
     * 展示列表
     */
    show (modelId) {
      this.modelId = modelId
      this.modelId = modelId
      this.init()
    },
    init () {
      this.visible = true
      this.queryPage()
    },
    queryPage () {
      this.loading = true
      itemPage({
        modelId: this.modelId,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
