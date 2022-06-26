<template>
  <a-drawer
    title="用户部门分配"
    :maskClosable="false"
    :width="640"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <a-spin :spinning="loading" style="margin-bottom: 2rem">
      <a-input style="margin-bottom: 8px" placeholder="筛选" allowClear v-model="searchName" @change="search"/>
      <a-tree
        :checkable="true"
        :checkStrictly="true"
        :checkedKeys="checkedKeys"
        :expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        @check="onCheck"
        @expand="onExpand"
      >
        <template #title="{ title }">
          <span v-if="title.indexOf(searchName) > -1">
            {{ title.substr(0, title.indexOf(searchName)) }}
            <span style="color: #f50">{{ searchName }}</span>
            {{ title.substr(title.indexOf(searchName) + searchName.length) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </a-spin>
    <div class="drawer-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="2" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="3" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="4" @click="closeAll">合并所有</a-menu-item>
          </a-menu>
        </template>
        <a-button>
          操作 <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-button @click="handleCancel()" style="margin-right: .8rem">取消</a-button>
      <a-button @click="handleSubmit()" type="primary" :loading="loading" style="margin-right: 0.8rem">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { tree } from '@/api/system/dept'
import { addUserDept, findDeptIdsByUser } from '@/api/system/userAssign'
import { treeDataTranslate } from '@/utils/util'
import XEUtils from 'xe-utils'
export default {
  name: 'UserDeptAssign',
  data () {
    return {
      userId: '',
      searchName: '',
      // 所有的key
      allTreeKeys: [],
      // 展开的key
      expandedKeys: [],
      // 被选中的key
      checkedKeys: [],
      autoExpandParent: true,
      visible: false,
      loading: false,
      treeData: [],
      // 树转换成的数组
      treeList: []
    }
  },
  methods: {
    async init (userId) {
      this.visible = true
      this.loading = true
      this.userId = userId
      this.searchName = ''
      this.expandedKeys = []
      // 权限树
      await tree().then(res => {
        this.treeData = treeDataTranslate(res.data, 'id', 'deptName')
        this.generateTreeList(res.data)
      })
      // 当前用户已经分配的部门
      await findDeptIdsByUser(userId).then(res => {
        this.checkedKeys = res.data
      })
      // 所有的key值
      this.allTreeKeys = this.treeList.map(item => item.id)
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
      addUserDept({
        userId: this.userId,
        deptIds: this.checkedKeys.checked
      }).then(() => {
        this.handleCancel()
      })
    },
    // 取消
    handleCancel () {
      this.visible = false
    },
    // 树数据铺平
    generateTreeList (treeData) {
      for (let i = 0; i < treeData.length; i++) {
        const node = treeData[i]
        this.treeList.push(node)
        if (node.children) {
          this.generateTreeList(node.children)
        }
      }
    },
    // 搜索
    search () {
      const searchName = XEUtils.toValueString(this.searchName).toLowerCase()
      this.expandedKeys = this.treeList.map(node => {
        if (searchName && node.parentId && XEUtils.toValueString(node.deptName).toLowerCase().indexOf(searchName) > -1) {
          return node.parentId
        }
      }).filter((item, i, self) => item && self.indexOf(item) === i)
    }
  }
}
</script>

<style scoped>

</style>
