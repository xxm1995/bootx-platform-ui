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
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称" />
      <vxe-table-column field="modelType" title="流程类型" />
      <vxe-table-column field="publish" title="发布状态">
        <template v-slot="{row}">
          <a-tag>{{ dictConvert('BpmModelPublish',row.publish) }}</a-tag>
        </template>
      </vxe-table-column>
      <!--      <vxe-table-column field="enable" title="启用状态" >-->
      <!--        <template v-slot="{row}">-->
      <!--          <a-tag v-if="row.enable" color="green">启用</a-tag>-->
      <!--          <a-tag v-else color="red">未启用</a-tag>-->
      <!--        </template>-->
      <!--      </vxe-table-column>-->
      <vxe-table-column field="mainProcess" title="是否主流程">
        <template v-slot="{row}">
          <a-tag v-if="row.mainProcess" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="processVersion" title="流程版本号">
        <template v-slot="{row}">
          <a-tag>{{ row.processVersion||'无' }}</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="备注" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="320" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a :disabled="row.publish === PUBLISHED" href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-upload
            name="file"
            :disabled="row.publish === PUBLISHED"
            :multiple="false"
            :accept="acceptType"
            :action="uploadAction"
            :headers="tokenHeader"
            :data="{id: row.id}"
            :showUploadList="false"
            @change="uploadChange">
            <a :disabled="row.publish === PUBLISHED" href="javascript:">上传BPMN</a>
          </a-upload>
          <a-divider type="vertical"/>
          <a :disabled="row.publish !== UNPUBLISHED_XML" href="javascript:" @click="taskSetting(row)">节点配置</a>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a :disabled="row.publish !== UNPUBLISHED_XML" href="javascript:" @click="publish(row)">发布</a>
                </a-menu-item>
                <a-menu-item>
                  <a :disabled="row.publish === PUBLISHED" href="javascript:" @click="remove(row)" :style="{color: row.publish === PUBLISHED?'':'red'}">删除</a>
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
    <bpm-model-edit ref="bpmModelEdit" @ok="init"/>
    <bpm-model-task-list ref="bpmModelTaskList"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, page, publish } from '@/api/bpm/model'
import BpmModelEdit from './BpmModelEdit'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
import { UploadMixin } from '@/mixins/UploadMixin'
import BpmModelTaskList from './BpmModelTaskList'

export default {
  name: 'BpmModelList',
  mixins: [TableMixin, UploadMixin],
  components: { BpmModelTaskList, BpmModelEdit },
  data () {
    return {
      // 流程定义已发布
      PUBLISHED: 'published',
      // 未发布, 已经上传bpmn文件
      UNPUBLISHED_XML: 'unpublishedXml',
      // 上传地址
      uploadUrl: '/bpm/model/uploadBpmn',
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
    taskSetting (record) {
      this.$refs.bpmModelTaskList.show(record.id)
    },
    remove (record) {
      this.$confirm({
        title: '警告',
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
     * 发布
     */
    publish (record) {
      this.$confirm({
        title: '警告',
        content: '是否发布当前流程模型',
        onOk: () => {
          this.loading = true
          publish(record.id).then(() => {
            this.$message.success('发布流程成功')
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
