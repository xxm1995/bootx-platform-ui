<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form-model :model="queryParam" layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="名称" prop="jobClassName">
              <a-input placeholder="请输入名称" v-model="queryParam.name"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-model-item label="AppId" prop="appId">
              <a-input placeholder="请输入AppId" v-model="queryParam.appId"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="query">查询</a-button>
            <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
    <we-chat-config-edit
      ref="weChatConfigEdit"
      @ok="handleOk"
    />
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { clearActivity, del, page, setUpActivity } from '@/api/pay/alipayConfig'
import WeChatConfigEdit from './WeChatConfigEdit'
export default {
  name: 'WeChatConfigList',
  mixins: [TableMixin],
  components: {
    WeChatConfigEdit
  },
  data () {
    return {
      queryParam: {
        name: '',
        appId: ''
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
        this.pagination.current = Number(res.data.current)
        this.pagination.total = Number(res.data.total)
        this.loading = false
      })
    },
    edit (record) {
      this.$refs.weChatConfigEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.weChatConfigEdit.init(record.id, 'show')
    },
    itemList (record) {
      this.$refs.weChatConfigEdit.init(record)
    },
    remove (record) {
      del(record.id).then(() => {
        this.$message.info('删除成功')
        this.init()
      })
    },
    setUpActivity (record) {
      setUpActivity(record.id).then(() => {
        this.init()
      })
    },
    clearActivity (record) {
      clearActivity(record.id).then(() => {
        this.init()
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
