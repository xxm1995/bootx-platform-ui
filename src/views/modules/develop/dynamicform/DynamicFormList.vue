<template>
  <a-card :bordered="false">
    <b-query
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
      :loading="loading"
      :data="tableData"
    >
      <vxe-table-column type="seq" title="序号" width="60" />
      <vxe-table-column field="name" title="名称"/>
      <vxe-table-column field="code" title="编码"/>
      <vxe-table-column field="remark" title="备注"/>
      <vxe-table-column field="createTime" title="创建时间" />
      <vxe-table-column fixed="right" width="240" :showOverflow="false" title="操作">
        <template v-slot="{row}">
          <span>
            <a href="javascript:" @click="show(row)">查看</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="edit(row)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <span>
            <a href="javascript:" @click="design(row.id)">表单设计</a>
          </span>
          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down" />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <a href="javascript:" @click="preview(row.id)">预览表单</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:">配置地址</a>
                </a-menu-item>
                <a-menu-item>
                  <a-popconfirm
                    title="是否删除该表单"
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
      @page-change="handleTableChange"/>
    <dynamic-design ref="dynamicDesign" />
    <dynamic-form-edit ref="dynamicFormEdit" @ok="handleOk"/>
    <dynamic-preview ref="dynamicPreview"/>
  </a-card>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import DynamicDesign from './DynamicDesign'
import DynamicFormEdit from './DynamicFormEdit'
import DynamicPreview from './DynamicPreview'
import { page, del } from '@/api/develop/dynamicForm'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'
export default {
  name: 'KFormList',
  mixins: [TableMixin],
  components: { DynamicDesign, DynamicFormEdit, DynamicPreview },
  data () {
    return {
      fields: [
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入表单名称' },
        { field: 'code', type: STRING, name: '编码', placeholder: '请输入表单编码' }
      ],
      queryParam: {
        name: '',
        code: ''
      }
    }
  },
  methods: {
    /**
     * 分页查询
     */
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
      this.$refs.dynamicFormEdit.init('', 'add')
    },
    edit (record) {
      this.$refs.dynamicFormEdit.init(record.id, 'edit')
    },
    show (record) {
      this.$refs.dynamicFormEdit.init(record.id, 'show')
    },
    /**
     * 表单预览
     */
    preview (id) {
      this.$refs.dynamicPreview.init(id)
    },
    /**
     * 表单设计
     */
    design (id) {
      this.$refs.dynamicDesign.init(id)
    },
    remove (record) {
      del(record.id).then(() => {
        this.$message.info('删除成功')
        this.init()
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
