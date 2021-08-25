<template>
  <a-drawer
    :title="title"
    :width="700"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading">
    <div :style="{width: '100%',border: '1px solid #e9e9e9',padding: '10px 16px',background: '#fff',}">
      <a-spin :spinning="confirmLoading">
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
              @change="onChangeMenuType"
              :disabled="showable"
              v-model="form.menuType"
            >
              <a-radio :value="0">一级菜单</a-radio>
              <a-radio :value="1">子菜单</a-radio>
              <a-radio :value="2">按钮/权限</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            :label="menuLabel"
            prop="name">
            <a-input
              placeholder="请输入菜单名称"
              v-model="form.name"
              :disabled="showable"
              :readOnly="disableSubmit"/>
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
              :disabled="disableSubmit || showable"
              @change="handleParentIdChange">
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            label="菜单路径"
            prop="url"
          >
            <a-input
              placeholder="请输入菜单路径"
              :disabled="showable"
              v-model="form.url"
              :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            label="前端组件"
            prop="component"
          >
            <a-input
              :disabled="showable"
              placeholder="前端组件"
              v-model="form.component"
              :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :disabled="showable"
            prop="redirect"
            label="默认跳转地址">
            <a-input
              :disabled="showable"
              placeholder="请输入路由参数 redirect"
              v-model="form.redirect"
              :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="!show"
            prop="perms"
            label="授权标识">
            <a-input
              :disabled="showable"
              placeholder="请输入授权标识, 如: user:list"
              v-model="form.perms"
              :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            prop="icon"
            label="菜单图标">
            <a-input
              :disabled="true"
              placeholder="点击选择图标"
              v-model="form.icon"
              :readOnly="true">
              <a-icon
                :disabled="showable"
                slot="addonAfter"
                type="setting"
                @click="selectIcons" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            prop="sortNo"
            label="排序">
            <a-input-number
              placeholder="请输入菜单排序"
              :disabled="showable"
              v-model="form.sortNo"
              style="width: 200px"
              :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            label="隐藏路由">
            <a-switch
              :disabled="showable"
              checkedChildren="是"
              unCheckedChildren="否"
              v-model="form.hidden"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            label="是否缓存路由">
            <a-switch
              :disabled="showable"
              checkedChildren="是"
              unCheckedChildren="否"
              v-model="form.keepAlive"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            label="打开方式">
            <a-switch
              :disabled="showable"
              checkedChildren="外部"
              unCheckedChildren="内部"
              v-model="form.internalOrExternal"/>
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
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          关闭
        </a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import { add, update, get, tree } from '@/api/system/menu'
import { treeDataTranslate } from '@/utils/util'
import { FormMixin } from '@/mixins/FormMixin'
import IconSelector from '@/components/IconSelector'
export default {
  name: 'MenuEdit',
  components: { IconSelector },
  mixins: [FormMixin],
  data () {
    return {
      disableSubmit: false,
      show: true, // 根据菜单类型，动态显示隐藏表单元素
      menuLabel: '菜单名称',
      form: {
        id: '',
        name: '',
        url: '',
        perms: '',
        parentId: '',
        parentName: '',
        component: '',
        redirect: '',
        sortNo: 0,
        icon: '',
        keepAlive: true,
        hidden: false,
        internalOrExternal: false,
        menuType: 0
      },
      rules: {
        name: [ { required: true, message: '请输入名称' } ],
        perms: [ { required: this.show, message: '请输入权限代码' } ],
        component: [{ required: this.show, message: '请输入前端组件!' }],
        url: [{ required: this.show, message: '请输入菜单路径!' }]
      },
      treeData: [],
      visibleIcon: false,
      currentSelectedIcon: 'pause-circle',
      iconChooseVisible: false,
      validateStatus: ''
    }
  },
  methods: {
    loadTree () {
      tree().then((res) => {
        this.treeData = treeDataTranslate(res.data, 'id', 'name')
      })
    },
    edit (id, type) {
      this.loadTree()
      if (type === 'edit' || type === 'show') {
        this.editable = true
        get(id).then(res => {
          this.form = res.data
        })
      } else {
        this.resetForm()
      }
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

    handleParentIdChange (value) {
      if (!value) {
        this.validateStatus = 'error'
      } else {
        this.validateStatus = 'success'
      }
    },
    onChangeMenuType (e) {
      if (this.form.menuType === 2) {
        this.show = false
        this.menuLabel = '按钮/权限'
      } else {
        this.show = true
        this.menuLabel = '菜单名称'
      }
      this.$nextTick(() => {
        this.$refs.form.validateField(['url', 'component'])
      })
    },
    // 选择图标弹出
    selectIcons () {
      this.visibleIcon = true
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
