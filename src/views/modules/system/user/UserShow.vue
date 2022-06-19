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
        <a-form-model-item label="邮箱">
          <a-input disabled v-model="form.email"/>
        </a-form-model-item>
        <a-form-model-item label="管理员">
          <a-switch checked-children="是" un-checked-children="否" v-model="form.admin" disabled/>
        </a-form-model-item>
        <a-form-model-item label="用户状态">
          <a-tag>{{ dictConvert(userStatusCode,form.status) }}</a-tag>
        </a-form-model-item>
        <a-form-model-item label="角色列表">
          <a-tag color="green" v-for="o in roles" :key="o.id">{{ o.name }}</a-tag>
        </a-form-model-item>
        <a-form-model-item label="终端列表">
          <a-tag color="green" v-for="o in clients" :key="o.id">{{ o.name }}</a-tag>
        </a-form-model-item>
        <a-form-model-item label="数据权限">
          <a-tag color="green" v-for="o in dataScopes" :key="o.id">{{ o.name }}</a-tag>
        </a-form-model-item>
        <a-form-model-item label="部门列表">
          <a-tag color="green" v-for="o in deptList" :key="o.id">{{ o.deptName }}</a-tag>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get } from '@/api/system/user'
import { getRoles, getDataScopes, getDeptList } from '@/api/system/userAssign'
import { findAllByAlonePrem } from '@/api/system/client'

export default {
  name: 'UserShow',
  mixins: [FormMixin],
  data () {
    return {
      userStatusCode: 'UserStatusCode',
      form: {
      },
      roles: [],
      clientList: [],
      clients: [],
      dataScopes: [],
      deptList: []
    }
  },
  methods: {
    async edit (id) {
      await get(id).then(res => {
        this.form = res.data
      })
      this.clients = this.getClients()
      await getRoles(id).then(res => {
        this.roles = res.data
      })
      await getDeptList(id).then(res => {
        this.deptList = res.data
      })
      await getDataScopes(id).then(res => {
        this.dataScopes = res.data
      })
      this.confirmLoading = false
    },
    // 获取用户关联终端信息
    getClients () {
      const clientIds = this.form.clientIdList
      return clientIds.map(clientId => {
        return this.getClientById(clientId)
      })
    },
    // 根据终端id获取终端对象
    getClientById (clientId) {
      const item = this.clientList.filter(client => {
        return clientId === client.id
      })
      if (item && item.length > 0) {
        return item[0]
      } else {
        return { }
      }
    },
    // 初始化终端列表
    async initClientList () {
      const { data } = await findAllByAlonePrem()
      this.clientList = data.map(res => {
        return {
          id: res.id,
          name: res.name
        }
      })
    }
  },
  created () {
    this.initClientList()
  }
}
</script>

<style scoped>

</style>
