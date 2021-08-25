<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="800"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <a-spin :spinning="loading">
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
    </a-spin>
    <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
          <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
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
import { tree } from '@/api/system/menu'
import { findIdsByRole, save } from '@/api/system/roleMenu'
import { treeDataTranslate } from '@/utils/util'

export default {
  name: 'RoleMenuModal',
  data () {
    return {
      title: '角色权限配置',
      roleId: '',
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      visible: false,
      checkedKeys: [],
      loading: false,
      treeData: []
    }
  },
  methods: {
    init: async function (roleId) {
      this.visible = true
      this.loading = true
      this.roleId = roleId
      await tree().then(res => {
        this.treeData = treeDataTranslate(res.data, 'id', 'name')
      })
      await findIdsByRole(roleId).then(res => {
        this.checkedKeys = res.data
      })
      this.loading = false
    },
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      this.selectedKeys = selectedKeys
    },

    handleCancel () {
      this.visible = false
    },
    expandAll () {
      this.expandedKeysss = this.allTreeKeys
    },
    closeAll () {
      this.expandedKeysss = []
    },
    checkALL () {
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL () {
      this.checkedKeys = []
    },
    switchCheckStrictly (v) {
      if (v === 1) {
        this.checkStrictly = false
      } else if (v === 2) {
        this.checkStrictly = true
      }
    },
    handleSubmit () {
      this.loading = true
      save({
        roleId: this.roleId,
        permissionIds: this.checkedKeys
      }).then(() => {
        this.handleCancel()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}

</style>
