<template>
  <a-modal
    title="用户数据权限分配"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-row>
        <a-col span="16" offset="4">
          <a-alert style="margin-bottom: 20px" message="注意！会清空用户原有分配的数据权限" banner closable/>
        </a-col>
      </a-row>
      <a-form-model
        ref="form"
        :model="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item
          label="数据权限"
          prop="dataScopeIds"
        >
          <a-select
            allowClear
            v-model="form.dataScopeId"
            :default-value="form.dataScopeId"
            :filter-option="searchRole"
            style="width: 100%"
            placeholder="选择数据权限"
          >
            <a-select-option v-for="o in dataScopeList" :key="o.id">
              {{ o.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { addUserDataScopeBatch } from '@/api/system/userAssign'
import { list as dataScopeList } from '@/api/system/dataScope'

export default {
  name: 'UserDataScopeAssignBatch',
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
      dataScopeList: [],
      userinfo: {
        account: '',
        name: ''
      },
      form: {
        userIds: [],
        dataScopeId: undefined
      }
    }
  },
  methods: {
    async edit (userIds) {
      this.form.userId = userIds
      this.visible = true
      this.confirmLoading = true
      // 获取数据角色列表
      await dataScopeList().then(value => {
        this.dataScopeList = value.data
      })
      this.confirmLoading = false
    },
    handleCancel () {
      this.visible = false
      this.resetForm()
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await addUserDataScopeBatch(this.form)
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
          this.$message.info('批量分配数据权限成功')
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    searchRole (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>

<style scoped>

</style>
