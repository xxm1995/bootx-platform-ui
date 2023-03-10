<template>
  <a-drawer
    :visible="visible"
    width="35%"
    title="数据源列表"
    :maskClosable="true"
    placement="right"
    :closable="true"
    @close="visible = false"
  >
    <vxe-toolbar
      custom
      zoom
      :refresh="{query: query}"
    >
    </vxe-toolbar>
    <vxe-table
      row-id="id"
      size="medium"
      :loading="loading"
      :data="records"
    >
      <vxe-column type="seq" title="序号" width="60"/>
      <vxe-column type="seq" width="60" />
      <vxe-column field="key" title="数据源" />
      <vxe-column title="操作" fixed="right" width="50" :showOverflow="false">
        <template v-slot="{row}">
          <a href="javascript:" @click="remove(row)" style="color: red">删除</a>
        </template>
      </vxe-column>
    </vxe-table>
  </a-drawer>
</template>

<script>
import { findAllDataSource, removeDataSourceByKey } from '@/api/develop/dynamicDataSource'

export default {
  name: 'DataSourceList',
  data () {
    return {
      visible: false,
      loading: false,
      records: []
    }
  },
  methods: {
    show () {
      this.visible = true
      this.query()
    },
    query () {
      this.loading = true
      findAllDataSource().then(({ data }) => {
        this.records = data
        this.loading = false
      })
    },
    remove (record) {
      this.$confirm({
        title: '移除',
        content: '是否将该数据源从系统中移除!',
        onOk: () => {
          this.loading = true
          removeDataSourceByKey(record.key).then(() => {
            this.$message.success('移除成功')
            this.query()
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
