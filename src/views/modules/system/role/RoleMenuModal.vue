<template>
  <a-drawer
    title="角色菜单配置"
    :maskClosable="false"
    :width="1000"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
  >
    <a-spin :spinning="loading" style="margin-bottom: 2rem">
      <a-input style="margin-bottom: 8px" placeholder="筛选" allowClear v-model="searchName" @change="search"/>
      <a-tree
        :checkable="true"
        v-model="checkedKeys"
        :expanded-keys="expandedKeys"
        :checkStrictly="checkStrictly"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        @check="onCheck"
        @expand="onExpand"
      >
        <template #title="{ title }">
          <span v-if="title.toLowerCase().indexOf(searchName.toLowerCase()) > -1">
            {{ searchRenderStart(title,searchName) }}
            <span style="color: #f50">
              {{ searchRenderMiddle(title,searchName) }}
            </span>
            {{ searchRenderEnd(title,searchName) }}
          </span>
          <span v-else>{{ title }}</span>
        </template>
      </a-tree>
    </a-spin>
    <div class="drawer-button">
      <a-select style="float: left" @change="clientSwitch" v-model="appCode">
        <a-select-option v-for="o in clientList" :key="o.code">{{ o.name }}</a-select-option>
      </a-select>
      <a-dropdown style="float: left;margin-left: 5px" :trigger="['click']" placement="topCenter">
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="checkALL">全部勾选</a-menu-item>
            <a-menu-item key="2" @click="cancelCheckALL">取消全选</a-menu-item>
            <a-menu-item key="3" @click="expandAll">展开所有</a-menu-item>
            <a-menu-item key="4" @click="closeAll">合并所有</a-menu-item>
            <a-menu-item key="5" @click="switchCheckStrictly(false)">父子关联</a-menu-item>
            <a-menu-item key="6" @click="switchCheckStrictly(true)">取消关联</a-menu-item>
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
import { findPermissionIdsByRole, save } from '@/api/system/roleMenu'
import { treeDataTranslate } from '@/utils/util'
import { allTree } from '@/api/system/permMenu'
import XEUtils from 'xe-utils'
import { findAllByAlonePrem } from '@/api/system/client'

export default {
  name: 'RoleMenuModal',
  data () {
    return {
      roleId: '',
      searchName: '',
      clientList: [],
      appCode: 'admin',
      // 父子选项默认不受控
      checkStrictly: true,
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
    // 终端列表
    initClientList () {
      findAllByAlonePrem().then(({ data }) => {
        this.clientList = data.map(res => {
          return {
            code: res.code,
            name: res.name
          }
        })
      })
    },
    // 初始化菜单分配信息
    async initAssign () {
      this.visible = true
      this.loading = true
      this.searchName = ''
      this.expandedKeys = []
      // 权限树
      await allTree(this.appCode).then(res => {
        this.treeData = treeDataTranslate(res.data, 'id', 'title')
        this.generateTreeList(res.data)
      })
      // 当前角色已经选择的
      await findPermissionIdsByRole(this.roleId, this.appCode).then(res => {
        this.checkedKeys = res.data
      })
      // 所有的key值
      this.allTreeKeys = this.treeList.map(item => item.id)
      this.loading = false
    },
    init (roleId) {
      this.roleId = roleId
      this.initClientList()
      this.initAssign()
    },
    // 展开/收起节点时触发
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 点击复选框触发
    onCheck (checkedKeys) {
      if (this.checkStrictly) {
        this.checkedKeys = checkedKeys.checked
      } else {
        this.checkedKeys = checkedKeys
      }
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
    // 切换父子受控状态
    switchCheckStrictly (v) {
      this.checkStrictly = v
    },
    // 终端切换
    clientSwitch (item) {
      this.appCode = item
      this.initAssign()
    },
    // 提交
    handleSubmit () {
      this.loading = true
      save({
        roleId: this.roleId,
        appCode: this.appCode,
        permissionIds: this.checkedKeys
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
        if (searchName && node.parentId && XEUtils.toValueString(node.title).toLowerCase().indexOf(searchName) > -1) {
          return node.parentId
        }
      }).filter((item, i, self) => item && self.indexOf(item) === i)
    },
    // 渲染搜索项目数据开始段
    searchRenderStart (title, searchName) {
      return title.substr(0, title.toLowerCase().indexOf(searchName.toLowerCase()))
    },
    // 渲染搜索项目数据中间段
    searchRenderMiddle (title, searchName) {
      return title.substr(title.toLowerCase().indexOf(searchName.toLowerCase()), title.toLowerCase().indexOf(searchName.toLowerCase()) + searchName.length)
    },
    // 渲染搜索项目数据结束段
    searchRenderEnd (title, searchName) {
      return title.substr(title.toLowerCase().indexOf(searchName.toLowerCase()) + searchName.length)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
