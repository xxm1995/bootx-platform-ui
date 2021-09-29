<template>
  <a-modal
    title="用户部门分配"
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
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="账号" prop="account">
          <a-input :disabled="true" v-model="userinfo.username"/>
        </a-form-model-item>
        <a-form-model-item label="用户" prop="name">
          <a-input :disabled="true" v-model="userinfo.name"/>
        </a-form-model-item>
        <a-form-model-item
          label="部门"
          prop="roleIds"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-tree-select
            allowClear
            multiple
            tree-default-expand-all
            mode="multiple"
            v-model="form.deptIds"
            :default-value="form.roleIds"
            :tree-data="deptTree"
            style="width: 100%"
            placeholder="选择部门"
          >
          </a-tree-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { tree } from '@/api/system/dept'
import { addUserDept, getDeptIds } from '@/api/system/user'
import { treeDataTranslate } from '@/utils/util'
export default {
  name: 'UserDeptAssign',
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
      deptTree: [],
      userinfo: {
        account: '',
        name: ''
      },
      form: {
        userId: '',
        deptIds: []
      }
    }
  },
  methods: {
    edit (userInfo, type) {
      this.userinfo = { ...userInfo }
      this.form.userId = userInfo.id
      this.visible = true
      // 获取部门树
      tree().then(({ data }) => {
        this.deptTree = treeDataTranslate(data, 'id', 'deptName')
      })
      // 获取用户部门信息
      getDeptIds(userInfo.id).then(({ data }) => {
        this.form.deptIds = data
      })
    },
    handleCancel () {
      this.visible = false
      this.resetForm()
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await addUserDept(this.form)
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
