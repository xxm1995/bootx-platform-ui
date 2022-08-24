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
      <vxe-table-column field="publish" title="发布状态" />
      <vxe-table-column field="enable" title="启用状态" >
        <template v-slot="{row}">
          <a-tag v-if="row.enable" color="green">启用</a-tag>
          <a-tag v-else color="red">未启用</a-tag>
        </template>
      </vxe-table-column>
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
      <vxe-table-column fixed="right" width="250" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical"/>
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical"/>
          <a-upload
            name="file"
            :multiple="false"
            :accept="acceptType"
            :action="uploadAction"
            :headers="tokenHeader"
            :data="{id: row.id}"
            :showUploadList="false"
            @change="uploadChange">
            <a href="javascript:">上传BPMN</a>
          </a-upload>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a-popconfirm
                    title="是否设为默认配置"
                    @confirm="setUpActivity(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:">设为默认</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否删除配置"
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
      border
      size="medium"
      :loading="loading"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @page-change="handleTableChange">
    </vxe-pager>
    <bpm-model-edit ref="bpmModelEdit" @ok="init"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { del, page } from '@/api/bpm/model'
import BpmModelEdit from './BpmModelEdit'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

export default {
  name: 'BpmModelList',
  mixins: [TableMixin],
  components: { BpmModelEdit },
  computed: {
    // 上传地址
    uploadAction () {
      return process.env.VUE_APP_API_BASE_URL + '/bpm/model/uploadBpmn'
    },
    // 请求头消息
    tokenHeader () {
      // 从 localstorage 获取 token
      const token = storage.get(ACCESS_TOKEN)
      return {
        AccessToken: token
      }
    }
  },
  data () {
    return {
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
    remove (record) {
      del(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    /**
     * 表单信息
     */
    uploadData (id) {
      return {
        id
      }
    },
    /**
     * 上传变动
     */
    uploadChange (info) {
      if (info.file.status === 'done') {
        if (!info.file.response.code) {
          this.init()
          this.$message.success(`${info.file.name} 上传成功!`)
        } else {
          this.$message.error(`${info.file.response.msg}`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error('上传失败')
      }
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
