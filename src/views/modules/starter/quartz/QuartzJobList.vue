<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form-model :model="queryParam" layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="任务类名" prop="jobClassName">
              <a-input placeholder="请输入任务类名" v-model="queryParam.jobClassName"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="任务状态" prop="status">
              <a-select
                allowClear
                style="width: 220px"
                v-model="queryParam.status"
                placeholder="请选择状态"
              >
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">正常</a-select-option>
                <a-select-option value="0">停止</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: init}"
    >
      <template #buttons>
        <a-space>
          <a-button type="primary" icon="plus" @click="add">新建</a-button>
          <a-button icon="sync" @click="syncJobStatus">状态同步</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="任务名称" />
      <vxe-table-column field="jobClassName" title="任务类名" />
      <vxe-table-column field="cron" title="cron" />
      <vxe-table-column field="parameter" title="参数" />
      <vxe-table-column field="state" title="状态" >
        <template v-slot="{row}">
          <a-tag v-if="row.state === 1" color="green">运行</a-tag>
          <a-tag v-else color="red">停用</a-tag>
        </template>
      </vxe-table-column>
      <vxe-table-column field="remark" title="描述" />
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="170" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <a href="javascript:" @click="edit(row)">编辑</a>
          <a-divider type="vertical" />
          <a href="javascript:" @click="show(row)">查看</a>
          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:" @click="logPage(row)">执行日志</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否立即运行该定时任务"
                    @confirm="execute(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:">立即运行</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item v-show="row.state === 0">
                  <a-popconfirm
                    title="是否启动定时任务"
                    @confirm="start(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:">启动</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item v-show="row.state === 1">
                  <a-popconfirm
                    title="是否停止定时任务"
                    @confirm="stop(row)"
                    okText="是"
                    cancelText="否">
                    <a href="javascript:" style="color: red">停止</a>
                  </a-popconfirm>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否删除定时任务"
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
      @page-change="handleTableChange"
    />
    <quartz-job-edit
      ref="quartzJobEdit"
      @ok="handleOk"
    />
    <quartz-job-log-list ref="quartzJobLogList"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { page, del, start, stop, execute, syncJobStatus } from '@/api/starter/quartz'
import QuartzJobEdit from './QuartzJobEdit'
import QuartzJobLogList from './QuartzJobLogList'

export default {
  name: 'QuartzJobList',
  mixins: [TableMixin],
  components: {
    QuartzJobEdit,
    QuartzJobLogList
  },
  data () {
    return {
      queryParam: {
        jobClassName: '',
        status: ''
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
      this.$refs.quartzJobEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.quartzJobEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.quartzJobEdit.init(record.id, 'show')
    },
    logPage (record) {
      this.$refs.quartzJobLogList.list(record.jobClassName)
    },
    remove (record) {
      del(record.id).then(() => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    start (record) {
      start(record.id).then(() => {
        this.$message.info('启动成功')
        this.init()
      })
    },
    stop (record) {
      stop(record.id).then(() => {
        this.$message.info('停止成功')
        this.init()
      })
    },
    execute (record) {
      execute(record.id).then(() => {
        this.$message.info('运行成功')
      })
    },
    // 同步任务状态
    syncJobStatus () {
      syncJobStatus().then(() => {
        this.$message.info('任务状态同步成功')
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
