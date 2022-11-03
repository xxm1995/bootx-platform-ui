<template>
  <a-modal
    :title="title"
    destroyOnClose
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <vxe-toolbar>
      <template #buttons>
        <b-query
          v-model="queryParam"
          :fields="fields"
          :default-item-md="8"
          @query="query"
          @reset="() => queryParam = {}"
        />
      </template>
    </vxe-toolbar>
    <vxe-table
      :height="350"
      row-id="id"
      ref="table"
      :checkbox-config="checkboxConfig"
      :radio-config="radioConfig"
      :loading="loading"
      :data="tableData">
      <vxe-column v-if="multiple" type="checkbox" width="40"/>
      <vxe-column v-if="!multiple" type="radio" width="40"/>
      <vxe-column field="name" title="角色名称" />
      <vxe-column field="code" title="角色编码" />
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
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" @click="handleOk">选择</a-button>
    </template>
  </a-modal>
</template>

<script>
import { TableMixin } from '@/mixins/TableMixin'
import { page } from '@/api/system/role'
import { STRING } from '@/components/Bootx/SuperQuery/superQueryCode'

export default {
  name: 'RoleSelectModel',
  mixins: [TableMixin],
  props: {
    title: {
      type: String,
      default: '选择角色'
    },
    // 是否是多选
    multiple: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  computed: {
    checkboxConfig () {
      return this.multiple ? {
        reserve: true,
        checkMethod: this.banCheckbox
      } : {}
    },
    radioConfig () {
      return !this.multiple ? {
        reserve: true,
        checkRowKey: this.selectRoleId
      } : {}
    }
  },
  data () {
    return {
      // 已经被选择的用户
      selectRoleIds: [],
      selectRoleId: null,
      visible: false,
      queryParam: {
        code: '',
        name: ''
      },
      fields: [
        { field: 'name', type: STRING, name: '名称', placeholder: '请输入角色名称' },
        { field: 'code', type: STRING, name: '编号', placeholder: '请输入角色编号' }
      ]
    }
  },
  methods: {
    /**
     * 调用 初始化
     * @param param 已经选中的用户ID或ID集合
     */
    init (param) {
      this.visible = true
      if (this.multiple) {
        this.selectRoleIds = param || this.selectRoleIds
      } else {
        this.selectRoleId = param || this.selectRoleId
      }
      this.queryPage()
    },
    /**
     * 查询
     */
    queryPage () {
      this.loading = true
      page({
        ...this.queryParam,
        ...this.pages
      }).then(res => {
        this.pageQueryResHandel(res, this)
      })
    },
    /**
     * 选中确定回调
     */
    handleOk () {
      if (this.multiple) {
        this.checkboxCallback()
      } else {
        this.radioCallback()
      }
      this.visible = false
    },

    /**
     * 复选回调
     * @return userIds 选中的用户id集合
     * @return users 选中的用户集合
     */
    checkboxCallback () {
      // 非本页选中的
      const reserveUsers = this.$refs.table.getCheckboxReserveRecords()
      // 本页选中的
      const checkUsers = this.$refs.table.getCheckboxRecords()
      const roles = reserveUsers.concat(checkUsers)
      const roleIds = roles.map(res => res.id)
      this.$emit('ok', roleIds, roles)
    },

    /**
     * 单选回调
     * @return userId 选中的用户id
     * @return user 选中的用户
     */
    radioCallback () {
      const role = this.$refs.table.getRadioRecord()
      const roleId = role?.id
      this.$emit('ok', roleId, role)
    },
    /**
     * 关闭
     */
    handleCancel () {
      this.visible = false
    },
    /**
     * 禁止选中的行 复选
     */
    banCheckbox ({ row }) {
      return !this.selectRoleIds.includes(row.id)
    },
    /**
     * 默认选中的行 单选
     */
    selectedRadio () {

    }
  }
}
</script>

<style scoped>

</style>
