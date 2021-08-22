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
          :rules="validatorRules">
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
            prop="name"
            hasFeedback>
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
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单路径"
            prop="url"
          >
            <a-input placeholder="请输入菜单路径" v-model="model.url" :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="前端组件"
            prop="component"
          >
            <a-input placeholder="前端组件" v-model="model.component" :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="默认跳转地址">
            <a-input placeholder="请输入路由参数 redirect" v-model="model.redirect" :readOnly="disableSubmit"/>
          </a-form-model-item>
          <a-form-model-item
            v-show="show"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="菜单图标">
            <a-input placeholder="点击选择图标" v-model="model.icon" :readOnly="disableSubmit">
              <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
            </a-input>
          </a-form-model-item>

        </a-form-model>

        <!-- 选择图标 -->
        <icon-selector v-model='currentSelectedIcon' @change="handleIconChange"/>
      </a-spin>
    </div>
  </a-drawer>
</template>

<script>
import { add, update, get, tree } from '@/api/iam/menu'
import { treeDataTranslate } from '@/utils/util'
import IconSelector from '@/components/IconSelector'
export default {
  name: 'MenuEdit',
  components: {IconSelector},
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
      disableSubmit:false,
      confirmLoading: false,
      show:true,//根据菜单类型，动态显示隐藏表单元素
      menuLabel:'菜单名称',
      model: {
        id: '',
        name: '',
        perms: '',
        parentId: '',
        parentName: '',
        menuType: 0
      },
      rules: {
        name: [ { required: true, message: '请输入名称' } ],
        perms: [ { required: true, message: '请输入权限代码' } ]
      },
      treeData: [],
      type: 'add',
      editable: false,
      addable: false,
      permsType: false,
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
      const that = this;
      tree().then((res)=>{
        that.treeData = [];
        let treeList = res.data
        that.treeData = treeDataTranslate(res.data,'id', 'name')
      })
    },
    edit (record, type) {
      this.visible = true
      if (type && type === 'add') {
        this.model.menuType = 0
        this.addable = true
        this.type = type
        this.resetForm()
      }
      if (type === 'edit') {
        this.editable = true
        this.type = type
      }
      if (type === 'show') {
        this.showTable = true
        this.type = type
      }
      this.init()
    },

    handleParentIdChange(value){
      if(!value){
        this.validateStatus="error"
      }else{
        this.validateStatus="success"
      }
    },
    onChangeMenuType(e) {
      if(this.model.menuType === 2){
        this.show = false;
        this.menuLabel = '按钮/权限';
      }else{
        this.show = true;
        this.menuLabel = '菜单名称';
      }
      this.$nextTick(() => {
        this.$refs.form.validateField(['url','component']);
      });
    },
    selectIcons(){
      this.iconChooseVisible = true
    },
    // 选择图表
    handleIconChange (icon) {
      console.log('icon',icon)
      this.form.resetFields(`icon`,icon);
      this.form.getFieldDecorator('icon', { initialValue: icon })
      this.visibleIcon = false
    },
    handleCancel () {
      this.close()
    },
    close () {
      this.$emit('close');
      this.disableSubmit = false;
      this.visible = false;
      this.$refs.form.resetFields();
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
