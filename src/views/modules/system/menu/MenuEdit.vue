<template>
  <a-drawer
    :title="title"
    :width="650"
    :mask-closable="showable"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading" style="margin-bottom: 3rem">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.id" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="菜单类型"
        >
          <a-radio-group
            :disabled="showable"
            v-model="form.menuType"
          >
            <a-radio :value="0">一级菜单</a-radio>
            <a-radio :value="1">子菜单</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          v-show="form.menuType!==0"
          label="上级菜单"
          :validate-status="validateStatus"
          :hasFeedback="true"
          :required="true">
          <span slot="help">{{ validateStatus==='error'?'请选择上级菜单':'&nbsp;&nbsp;' }}</span>
          <a-tree-select
            style="width:100%"
            :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
            :tree-data="treeData"
            v-model="form.parentId"
            placeholder="请选择父级菜单"
            :disabled="showable"
            @change="handleParentIdChange">
          </a-tree-select>
        </a-form-model-item>
        <a-form-model-item
          label="菜单名称"
          prop="title">
          <a-input
            placeholder="请输入菜单名称"
            v-model="form.title"
            :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="路由名称"
          prop="name">
          <a-input
            placeholder="请输入路由名称"
            v-model="form.name"
            :disabled="showable">
            <template v-slot:suffix>
              <a-tooltip
                title="尽量保证路由名称的唯一"
              >
                <a-icon type="info-circle"/>
              </a-tooltip>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item
          label="菜单路径"
          prop="path"
        >
          <a-input
            v-model="form.path"
            :disabled="showable"
            placeholder="请输入菜单路径"
          >
            <template v-slot:suffix>
              <a-tooltip
                title="路由访问路径"
              >
                <a-icon type="info-circle"/>
              </a-tooltip>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item
          label="前端组件"
          prop="component"
        >
          <a-input
            :disabled="showable"
            placeholder="请输入前端组件"
            v-model="form.component">
            <template v-slot:suffix>
              <a-tooltip
                title="输入组件名称或者组件路径地址，路径地址情况，默认已经带有'@/views/modules/'前缀"
              >
                <a-icon type="info-circle"/>
              </a-tooltip>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item
          :disabled="showable"
          prop="redirect"
          label="默认跳转地址">
          <a-input
            :disabled="showable"
            placeholder="请输入路由参数 redirect"
            v-model="form.redirect"/>
        </a-form-model-item>
        <a-form-model-item
          prop="icon"
          label="菜单图标">
          <a-input
            :disabled="showable"
            placeholder="点击选择图标"
            v-model="form.icon">
            <template v-slot:addonAfter>
              <a-icon
                type="setting"
                @click="selectIcons" />
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item
          prop="sortNo"
          label="排序">
          <a-input-number
            placeholder="请输入菜单排序，可以是小数"
            :disabled="showable"
            v-model="form.sortNo"
            style="width: 200px"/>
        </a-form-model-item>
        <a-form-model-item
          prop="hidden"
          label="隐藏菜单">
          <a-switch
            :disabled="showable"
            checkedChildren="是"
            unCheckedChildren="否"
            v-model="form.hidden"/>
        </a-form-model-item>
        <a-form-model-item
          prop="hideChildrenInMenu"
          label="隐藏子菜单">
          <a-switch
            :disabled="showable"
            checkedChildren="是"
            unCheckedChildren="否"
            v-model="form.hideChildrenInMenu"/>
        </a-form-model-item>
        <a-form-model-item
          prop="hiddenHeaderContent"
          label="隐藏的标题内容">
          <a-switch
            :disabled="showable"
            checkedChildren="是"
            unCheckedChildren="否"
            v-model="form.hiddenHeaderContent"/>
        </a-form-model-item>
        <a-form-model-item
          prop="keepAlive"
          label="是否缓存路由">
          <a-switch
            :disabled="showable"
            checkedChildren="是"
            unCheckedChildren="否"
            v-model="form.keepAlive"/>
        </a-form-model-item>
        <a-form-model-item
          prop="targetOutside"
          label="打开方式">
          <a-switch
            :disabled="showable"
            checkedChildren="外部"
            unCheckedChildren="内部"
            v-model="form.targetOutside"/>
        </a-form-model-item>

      </a-form-model>
      <a-modal
        :width="850"
        :visible="visibleIcon"
        @cancel="handleCancelIcon"
        footer=""
        :mask="false"
        :closable="false"
        :destroyOnClose="true"
      >
        <icon-selector v-model="form.icon" @change="handleIconChange"/>
      </a-modal>
    </a-spin>
    <div class="drawer-button" >
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">关闭</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import { add, update, get, menuTree } from '@/api/system/permMenu'
import { treeDataTranslate } from '@/utils/util'
import { FormMixin } from '@/mixins/FormMixin'
import IconSelector from '@/components/IconSelector'
export default {
  name: 'MenuEdit',
  components: { IconSelector },
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: '',
        parentId: '',
        title: '',
        name: '',
        path: '',
        component: '',
        redirect: '',
        sortNo: 0,
        icon: '',
        hidden: false,
        hideChildrenInMenu: false,
        keepAlive: true,
        hiddenHeaderContent: false,
        targetOutside: false,
        menuType: 0
      },
      treeData: [],
      visibleIcon: false,
      validateStatus: ''
    }
  },
  computed: {
    rules () {
      return {
        title: [ { required: true, message: '请输入菜单或权限名称' } ],
        name: [ { required: true, message: '请输入路由名称' } ],
        path: [ { required: true, message: '请输入菜单路径' } ],
        url: [{ required: true, message: '请输入菜单路径' }]
      }
    }
  },
  methods: {
    loadTree () {
      menuTree().then((res) => {
        this.treeData = treeDataTranslate(res.data, 'id', 'title')
      })
    },
    async edit (id, type, row) {
      this.confirmLoading = true
      await this.loadTree()
      if (type === 'edit' || type === 'show') {
        this.editable = true
        const res = await get(id)
        this.form = res.data
      } else {
        // 新增
        this.confirmLoading = false
        // 添加下级
        if (row) {
          this.form.menuType = 1
          this.$nextTick(() => {
            this.form.parentId = row.id
            this.form.path = row.path
          })
        }
      }
      this.confirmLoading = false
    },
    handleOk () {
      const that = this
      this.$refs.form.validate(async valid => {
        if (valid) {
          if ((this.form.menuType === 1 || this.form.menuType === 2) && !this.form.parentId) {
            that.validateStatus = 'error'
            that.$message.error('请检查你填的类型以及信息是否正确！')
            return
          } else {
            that.validateStatus = 'success'
          }
          that.confirmLoading = true
          if (this.type === 'add') {
            await add(this.form)
          } else {
            await update(this.form)
          }
          setTimeout(() => {
            this.confirmLoading = false
            this.$emit('ok')
            this.visible = false
          }, 200)
        }
      })
    },
    /**
     * 选择父级验证情况
     */
    handleParentIdChange (value) {
      if (!value) {
        this.validateStatus = 'error'
      } else {
        this.validateStatus = 'success'
      }
    },
    // 选择图标弹出
    selectIcons () {
      if (!this.showable) {
        this.visibleIcon = true
      }
    },
    // 取消选择图标
    handleCancelIcon () {
      this.visibleIcon = false
    },
    // 选择图标
    handleIconChange (icon) {
      this.visibleIcon = false
      this.form.icon = icon
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    }
  }
}
</script>

<style scoped>

</style>
