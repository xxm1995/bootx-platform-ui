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
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        :model="form">
        <a-form-model-item label="用户账号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="username">
          <a-input v-model="form.username" disabled/>
        </a-form-model-item>
        <a-form-model-item label="用户名称" prop="name">
          <a-input v-model="form.name" disabled/>
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="phone">
          <a-input disabled v-model="form.phone"/>
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input disabled v-model="form.email"/>
        </a-form-model-item>
        <a-form-model-item label="管理员" prop="email">
          <a-switch checked-children="是" un-checked-children="否" v-model="form.admin" disabled/>
        </a-form-model-item>
        <a-form-model-item label="用户状态" prop="email">
          <a-tag>{{ dictConvert(userStatusCode,form.status) }}</a-tag>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get } from '@/api/system/user'

export default {
  name: 'UserShow',
  mixins: [FormMixin],
  data () {
    return {
      userStatusCode: 'UserStatusCode',
      form: {
      }
    }
  },
  methods: {
    edit (id) {
      get(id).then(res => {
        this.form = res.data
        this.confirmLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
