<template>
  <a-drawer
    :title="title"
    :maskClosable="false"
    :width="800"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <a-spin :spinning="loading" style="margin-bottom: 2rem">
      <a-input style="margin-bottom: 8px" placeholder="筛选" allowClear @change="search"/>
      <a-tree
        :checkable="true"
        v-model="checkedKeys"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :selected-keys="selectedKeys"
        :tree-data="treeData"
        @check="onCheck"
        @expand="onExpand"
        @select="onSelect"
      />
<!--      <vxe-table-->
<!--        resizable-->
<!--        border="none"-->
<!--        :show-header="false"-->
<!--        :tree-config="{children: 'children'}"-->
<!--        :row-config="{height: 20}"-->
<!--        :checkbox-config="{labelField: 'title'}"-->
<!--        :data="treeData"-->
<!--        @checkbox-change="onCheck">-->
<!--        <vxe-column height="auto" type="checkbox" tree-node/>-->
<!--      </vxe-table>-->
    </a-spin>
    <div class="drawer-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button>
          树操作 <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-button @click="handleCancel()" style="margin-right: .8rem">取消</a-button>
      <a-button @click="handleSubmit()" type="primary" :loading="loading" style="margin-right: 0.8rem">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { findPermissionIdsByRole, findPermissionIds, save } from '@/api/system/roleMenu'
import { treeDataTranslate } from '@/utils/util'
import { allTree } from '@/api/system/permMenu'

export default {
  name: 'RoleMenuModal',
  data () {
    return {
      title: '角色菜单配置',
      roleId: '',
      allTreeKeys: [],
      expandedKeys: [],
      selectedKeys: [],
      checkedKeys: [],
      autoExpandParent: true,
      visible: false,
      loading: false,
      treeData: []
    }
  },
  methods: {
    init: async function (roleId) {
      this.visible = true
      this.loading = true
      this.roleId = roleId
      // 获取全部权限码
      findPermissionIds().then(res => {
        this.allTreeKeys = res.data
      })
      // 权限树
      await allTree().then(res => {
        this.treeData = treeDataTranslate(res.data, 'id', 'title')
      })
      // 当前角色已经选择的
      await findPermissionIdsByRole(roleId).then(res => {
        this.checkedKeys = res.data
      })
      this.loading = false
    },
    // 展开/收起节点时触发
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 点击复选框触发
    onCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    // 点击树节点触发
    onSelect (selectedKeys) {
      this.selectedKeys = selectedKeys
    },
    // 展开全部
    expandAll () {
      this.expandedKeys = this.allTreeKeys
    },
    // 合并全部
    closeAll () {
      this.expandedKeys = []
    },
    // 全选
    checkALL () {
      this.checkedKeys = this.allTreeKeys
    },
    // 全不选
    cancelCheckALL () {
      this.checkedKeys = []
    },
    // 提交
    handleSubmit () {
      this.loading = true
      save({
        roleId: this.roleId,
        permissionIds: this.checkedKeys
      }).then(() => {
        this.handleCancel()
      })
    },
    // 取消
    handleCancel () {
      this.visible = false
    },
    search (e) {
      const searchName = e.target.value
    }
  }
}
</script>

<style lang="less" scoped>
</style>
