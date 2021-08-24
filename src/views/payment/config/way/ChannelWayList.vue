<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="支付通道">
              <a-select
                allowClear
                v-model="queryParam.channelId"
                :default-value="null"
                style="width: 100%"
                placeholder="选择通道"
              >
                <a-select-option v-for="o in channelList" :key="o.id">
                  {{ o.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="支付方式">
              <a-input v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="() => {this.resetPage();this.init()}">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.channelWayEdit.edit('','add')">新建</a-button>
    </div>
    <a-table
      bordered
      :columns="columns"
      :dataSource="tableData"
      :loading="loading"
      :pagination="pagination"
      :rowKey="record => record.id"
      @change="handleTableChange"
      :scroll="{ x: 1500 }"
    >
    </a-table>
    <channel-way-edit
      ref="channelWayEdit"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { page, del } from '@/api/payment/channelWay'
import { getChannels } from '@/api/payment/channel'
import ChannelWayEdit from './ChannelWayEdit'

export default {
  name: 'PayChannelWayList',
  components: {
    ChannelWayEdit
  },
  data () {
    return {
      loading: false,
      columns: [
        {
          title: '#',
          width: '80px',
          customRender: (text, record, index) => {
            return (
              <div>
                {index + 1}
              </div>
            )
          }
        },
        {
          title: '支付通道编码',
          dataIndex: 'channelCode'
        },
        {
          title: '支付通道名称',
          dataIndex: 'channelName',
          customRender: (text, record, index) => {
            return record.channelCode
          }
        },
        {
          title: '支付方式名称',
          dataIndex: 'name'
        },
        {
          title: '支付方式编码',
          dataIndex: 'code'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '150px',
          align: 'center',
          fixed: 'right',
          customRender: (text, record, index) => {
            return (
              <div>
                <a href="javascript:"
                   onClick={(e) => this.show(record)}
                >查看</a>
                <a-divider type='vertical' />
                <a-dropdown>
                  <a className='ant-dropdown-link'>
                    更多操作 <a-icon type='down' />
                  </a>
                  <a-menu slot='overlay'>
                    <a-menu-item>
                      <a onClick={(e) => this.edit(record)}>修改</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm title='是否删除' onConfirm={(e) => this.delete(record)} okText='是' cancelText='否'>
                        <a-icon slot='icon' type='question-circle-o' style='color: red' />
                        <a href='javascript:' style='color: red'>删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </div>
            )
          }
        }
      ],
      channelList: [],
      tableData: [],
      pagination: {
        pageSize: 10,
        current: 1,
        total: 0,
        showSizeChanger: true
      },
      pages: {
        size: 10,
        current: 1
      },
      queryParam: {
        channelId: '',
        code: '',
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
        this.tableData = res.data.records
        this.pagination.total = res.data.total
        // 当前页取决于后端
        this.pagination.current = Number(res.data.current)
        this.loading = false
      })
    },
    // 重置当前页数
    resetPage () {
      this.pages = {
        size: 10,
        current: 1,
        pages: 0
      }
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.pages.size = pagination.pageSize
      this.pages.current = pagination.current
      this.init()
    },
    // 初始化通道列表
    initChannelList () {
      getChannels().then(res => {
        this.channelList = res.data
      })
    },
    edit (record) {
      this.$refs.channelWayEdit.edit(record.id, 'edit')
    },
    delete (record) {
      del(record.id).then(res => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    show (record) {
      this.$refs.channelWayEdit.edit(record.id, 'show')
    },
    handleOk () {
      this.init()
    }
  },
  created () {
    this.initChannelList()
    this.init()
  }
}
</script>

<style scoped>

</style>