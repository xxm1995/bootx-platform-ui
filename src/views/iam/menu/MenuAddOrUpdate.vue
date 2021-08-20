<template>
  <a-modal
    title="权限管理"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="上级名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          v-show="permsType"
        >
          <a-input :disabled="true" v-model="form.parentName"/>
        </a-form-model-item>
        <a-form-model-item
          label="类型"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            v-model="form.menuType"
          >
            <a-select-option :value="0" :disabled="permsType">
              一级菜单
            </a-select-option>
            <a-select-option :value="1">
              子菜单
            </a-select-option>
            <a-select-option :value="2">
              按钮
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          prop="name"
          label="名称"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showable"
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item
          label="权限代码"
          prop="perms"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showable"
            v-model="form.perms"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>

    <template slot="footer">
      <div v-show="!showable">
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </div>
    </template>
  </a-modal>
</template>

<script>
  import { add, update, get } from '@/api/iam/menu'
  export default {
    name: 'MenuAddOrUpdate',
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
        confirmLoading: false,
        form: {
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
        type: 'add',
        editable: false,
        addable: false,
        showable: false,
        permsType: false,
        treeData: []
      }
    },
    methods: {
      edit (tmpRecord, type, permsType) {
        this.permsType = permsType
        this.visible = true
        this.addable = true
        this.type = type
        this.$nextTick(() => {
          this.$set(this.form, 'parentId', tmpRecord.id)
          this.$set(this.form, 'parentName', tmpRecord.name)
          this.resetForm()
        })
        if (type === 'edit') {
          this.editable = true
          this.type = type
        }
        if (type === 'show') {
          this.showable = true
          this.type = type
        }

        if (['edit', 'show'].includes(type)) {
          this.confirmLoading = true
          get(tmpRecord.id).then(res => {
            this.form = res.data
            this.confirmLoading = false
          }).catch(err => {
            this.$message.error(err.msg)
          })
        }
      },
      handleOk () {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.confirmLoading = true
            if (this.type === 'add') {
              await add(this.form).catch(err => this.$message.error(err.msg))
            } else if (this.type === 'edit') {
              await update(this.form).catch(err => this.$message.error(err.msg))
            }
            setTimeout(() => {
              this.confirmLoading = false
              this.$emit('ok')
              this.visible = false
            }, 200)
          } else {
            return false
          }
        })
      },
      handleCancel () {
        this.visible = false
        this.resetForm()
        setTimeout(() => {
          this.addable = false
          this.showable = false
          this.editable = false
        }, 200)
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
