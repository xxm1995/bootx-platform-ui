<template>
  <a-modal
    title="用户角色分配"
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
        <a-form-model-item has-feedback label="权限编码" prop="code">
          <a-descriptions>
            <a-descriptions-item>{{ userinfo.code }}</a-descriptions-item>
          </a-descriptions>
        </a-form-model-item>
        <a-form-model-item has-feedback label="描述" prop="description">
          <a-descriptions>
            <a-descriptions-item >{{ userinfo.description }}</a-descriptions-item>
          </a-descriptions>
        </a-form-model-item>
        <a-form-model-item
          label="角色"
          prop="roleIds"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-select
            allowClear
            mode="multiple"
            v-model="form.roleIds"
            :default-value="form.roleIds"
            style="width: 100%"
            placeholder="选择角色"
          >
            <a-select-option v-for="o in roleList" :key="o.id">
              {{ o.name }}
            </a-select-option>
          </a-select>
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
import { list as roleList } from '@/api/iam/role'
import { addPathRole, getRoleIds } from '@/api/iam/path'

export default {
  name: 'PathRoleEdit',
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
      roleList: [],
      pathInfo: {
        code: '',
        name: ''
      },
      form: {
        pathId: '',
        roleIds: []
      }
    }
  },
  methods: {
    edit (pathInfo, type) {
      this.userinfo = { ...pathInfo }
      this.form.permissionId = pathInfo.id
      this.visible = true
      // 获取角色列表
      roleList().then(value => {
        this.roleList = value.data
      })
      // 获取角色信息
      getRoleIds(pathInfo.id).then(({ data }) => {
        this.form.roleIds = data
      })
    },
    handleCancel () {
      this.visible = false
      this.resetForm()
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await addPathRole(this.form)
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