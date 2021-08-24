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
          :model="model"
          :rules="rules">
          <a-form-model-item
            label="菜单类型"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol" >
            <a-radio-group
              @change="onChangeMenuType"
              v-model="model.menuType"
            >
              <a-radio :value="0">一级菜单</a-radio>
              <a-radio :value="1">子菜单</a-radio>
              <a-radio :value="2">按钮/权限</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :label="menuLabel"
            prop="name">
            <a-input
              placeholder="请输入菜单名称"
              v-model="model.name"
              :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="model.menuType!==0"
            label="上级菜单"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :validate-status="validateStatus"
            :hasFeedback="true"
            :required="true">
            <span slot="help">{{ validateStatus==='error'?'请选择上级菜单':'&nbsp;&nbsp;' }}</span>
            <a-tree-select
              style="width:100%"
              :dropdown-style="{ maxHeight: '200px', overflow: 'auto' }"
              :tree-data="treeData"
              v-model="model.parentId"
              placeholder="请选择父级菜单"
              :disabled="disableSubmit"
              @change="handleParentIdChange">
            </a-tree-select>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单路径"
            prop="url"
          >
            <a-input
              placeholder="请输入菜单路径"
              v-model="model.url"
              :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="前端组件"
            prop="component"
          >
            <a-input placeholder="前端组件" v-model="model.component" :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            prop="redirect"
            label="默认跳转地址">
            <a-input placeholder="请输入路由参数 redirect" v-model="model.redirect" :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="!show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            prop="perms"
            label="授权标识">
            <a-input placeholder="请输入授权标识, 如: user:list" v-model="model.perms" :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            prop="icon"
            label="菜单图标">
            <a-input placeholder="点击选择图标" v-model="model.icon" :readOnly="true">
              <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
            </a-input>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            prop="sortNo"
            label="排序">
            <a-input-number
              placeholder="请输入菜单排序"
              v-model="model.sortNo"
              style="width: 200px"
              :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="隐藏路由">
            <a-switch checkedChildren="是" unCheckedChildren="否" v-model="model.hidden"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否缓存路由">
            <a-switch checkedChildren="是" unCheckedChildren="否" v-model="model.keepAlive"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="打开方式">
            <a-switch checkedChildren="外部" unCheckedChildren="内部" v-model="model.internalOrExternal"/>
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
          <icon-selector v-model="model.icon" @change="handleIconChange"/>
        </a-modal>
      </a-spin>
      <a-row :style="{textAlign:'right'}">
        <a-button :style="{marginRight: '8px'}" @click="handleCancel">
          关闭
        </a-button>
        <a-button :disabled="disableSubmit" @click="handleOk" type="primary">确定</a-button>
      </a-row>
    </div>
  </a-drawer>
</template>

<script>
import { add, update, get, tree } from '@/api/system/menu'
import { treeDataTranslate } from '@/utils/util'
import IconSelector from '@/components/IconSelector'
export default {
  name: 'MenuEdit',
  components: { IconSelector },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      disableSubmit: false,
      confirmLoading: false,
      show: true, // 根据菜单类型，动态显示隐藏表单元素
      menuLabel: '菜单名称',
      model: {
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
      type: 'add',
      editable: false,
      addable: false,
      visibleIcon: false,

      title: '',
      currentSelectedIcon: 'pause-circle',
      iconChooseVisible: false,
      validateStatus: ''
    }
  },
  methods: {
    init () {
      this.loadTree()
    },
    loadTree () {
      tree().then((res) => {
        this.treeData = treeDataTranslate(res.data, 'id', 'name')
      })
    },
    edit (id, type) {
      this.visible = true
      this.type = type

      if (type && type === 'add') {
        this.model.menuType = 0
        this.addable = true
        this.resetForm()
      }
      if (type === 'edit' || type === 'show') {
        this.editable = true
        get(id).then(res => {
          this.model = res.data
        })
      }
      this.init()
    },

    handleOk () {
      const that = this
      this.$refs.form.validate(async valid => {
        if (valid) {
          if ((this.model.menuType === 1 || this.model.menuType === 2) && !this.model.parentId) {
            that.validateStatus = 'error'
            that.$message.error('请检查你填的类型以及信息是否正确！')
            return
          } else {
            that.validateStatus = 'success'
          }
          that.confirmLoading = true
          console.log(this.model)
          if (this.type === 'add') {
            await add(this.model)
          } else {
            await update(this.model)
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
      if (this.model.menuType === 2) {
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
      this.model.icon = icon
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close')
      this.disableSubmit = false
      this.visible = false
      this.$refs.form.resetFields()
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
        this.form = {}
      })
    }
  }
}
</script>

<style scoped>

</style>
