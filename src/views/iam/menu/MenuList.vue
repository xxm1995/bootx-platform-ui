<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.permissionAddOrUpdate.edit('','add',false)">新建</a-button>
    </div>
    <vxe-table
      resizable
      border="inner"
      ref="xTree"
      :tree-config="{children: 'childs'}"
      :data="tableData1"
      @toggle-tree-expand="toggleExpandChangeEvent">
      <vxe-table-column field="name" title="app.body.label.name" tree-node></vxe-table-column>
      <vxe-table-column field="size" title="Size"></vxe-table-column>
      <vxe-table-column field="type" title="Type"></vxe-table-column>
      <vxe-table-column field="date" title="Date"></vxe-table-column>
    </vxe-table>
    <permission-add-or-update
      ref="permissionAddOrUpdate"
      @ok="handleOk"/>
  </a-card>
</template>

<script>
import { list, delObj } from '@/api/iam/menu'
import permissionAddOrUpdate from './MenuAddOrUpdate'
export default {
  name: 'MenuList',
  components: {
    permissionAddOrUpdate
  },
  data () {
    return {
      loading: false,
      tableData1: [
        { id: 1000, name: 'vxe-table 从入门到放弃1', type: 'mp3', size: 1024, date: '2020-08-01' },
        {
          id: 1005,
          name: 'Test2',
          type: 'mp4',
          size: null,
          date: '2021-04-01',
          childs: [
            { id: 24300, name: 'Test3', type: 'avi', size: 1024, date: '2020-03-01' },
            { id: 20045, name: 'vxe-table 从入门到放弃4', type: 'html', size: 600, date: '2021-04-01' },
            {
              id: 10053,
              name: 'vxe-table 从入门到放弃96',
              type: 'avi',
              size: null,
              date: '2021-04-01',
              childs: [
                { id: 24330, name: 'vxe-table 从入门到放弃5', type: 'txt', size: 25, date: '2021-10-01' },
                { id: 21011, name: 'Test6', type: 'pdf', size: 512, date: '2020-01-01' },
                { id: 22200, name: 'Test7', type: 'js', size: 1024, date: '2021-06-01' }
              ]
            }
          ]
        },
        { id: 23666, name: 'Test8', type: 'xlsx', size: 2048, date: '2020-11-01' },
        { id: 24555, name: 'vxe-table 从入门到放弃9', type: 'avi', size: 224, date: '2020-10-01' }
      ],
      tableData: []
    }
  },
  methods: {
    init () {
      this.loading = true
      list().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    edit (record) {
      this.$refs.permissionAddOrUpdate.edit(record, 'edit')
    },
    deleteItem (record) {
      delObj(record.id).then(_ => {
        this.$message.info('删除成功')
        this.init()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    handleOk () {
      this.init()
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>

</style>
