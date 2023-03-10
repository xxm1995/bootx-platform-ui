<template>
  <a-drawer
    title="数据源管理"
    width="40%"
    :visible="visible"
    :destroyOnClose="true"
    :maskClosable="false"
    @close="handleCancel">
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.id" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="编码"
          prop="code"
        >
          <a-input v-model="form.code" :disabled="showable" placeholder="请输入编码"/>
        </a-form-model-item>
        <a-form-model-item
          label="名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable" placeholder="请输入名称"/>
        </a-form-model-item>
        <a-form-model-item
          label="数据库类型"
          prop="databaseType"
        >
          <a-select
            v-model="form.databaseType"
            :disabled="showable"
            :options="databaseTypes"
            @change="changeDatabaseType"
            placeholder="请选择数据库类型"
          />
        </a-form-model-item>
        <a-form-model-item
          label="驱动类"
          prop="dbDriver"
        >
          <a-input v-model="form.dbDriver" placeholder="请输入驱动类"/>
        </a-form-model-item>
        <a-form-model-item
          label="数据库地址"
          prop="dbUrl"
        >
          <a-input v-model="form.dbUrl" :disabled="showable" placeholder="请输入数据库地址"/>
        </a-form-model-item>
        <a-form-model-item
          label="用户名"
          prop="dbUsername"
        >
          <a-input v-model="form.dbUsername" :disabled="showable" placeholder="请输入数据库用户名"/>
        </a-form-model-item>
        <a-form-model-item
          label="密码"
          prop="dbPassword"
        >
          <a-input-password v-model="form.dbPassword" :disabled="showable" placeholder="请输入数据库密码"/>
        </a-form-model-item>
        <a-form-model-item
          label="备注"
          prop="remark"
        >
          <a-textarea v-model="form.remark" :disabled="showable" placeholder="请输入备注"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <div class="drawer-button" >
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="addable" preIcon="ant-design:api-outlined" @click="testConnectionInfo">测试连接</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import {
  get,
  add,
  update,
  databaseTypeMap,
  databaseTypes,
  existsByCodeNotId,
  existsByCode, testConnection
} from '@/api/develop/dynamicDataSource'
export default {
  name: 'DynamicDataSourceEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        code: null,
        name: null,
        databaseType: undefined,
        dbDriver: undefined,
        dbUrl: null,
        dbName: null,
        dbUsername: null,
        dbPassword: null,
        remark: null
      },
      databaseTypes,
      databaseTypeMap,
      rules: {
        code: [
          { required: true, message: '编码不可为空' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [{ required: true, message: '名称不可为空' }],
        databaseType: [{ required: true, message: '请选择数据库类型' }],
        dbDriver: [{ required: true, message: '驱动不可为空' }],
        dbUrl: [{ required: true, message: '数据源地址不可为空' }],
        dbUsername: [{ required: true, message: '用户名不可为空' }],
        dbPassword: [{ required: true, message: '密码不可为空' }]
      }
    }
  },
  methods: {
    /**
     * 编辑
     */
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.rawForm = { ...res.data }
          this.confirmLoading = false
        })
      } else {
        this.confirmLoading = false
      }
    },
    /**
     * 提交
     */
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          if (this.type === 'add') {
            await add(this.form)
          } else if (this.type === 'edit') {
            await update({ ...this.form, ...this.diffForm(this.rawForm, this.form, 'dbPassword') })
          }
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
        } else {
          return false
        }
      })
    },
    // 验证编码
    async validateCode (rule, value, callback) {
      const { code, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await existsByCodeNotId(code, id)
      } else {
        res = await existsByCode(code)
      }
      if (!res.data) {
        callback()
      } else {
        callback('该编码已存在!')
      }
    },
    // 测试连接
    async testConnectionInfo () {
      this.$refs.form.validateField(['dbDriver', 'dbUrl', 'dbUsername', 'dbPassword'])
      const { dbDriver, dbUrl, dbUsername, dbPassword } = this.form
      if (dbDriver && dbUrl && dbUsername && dbPassword) {
        const { data } = await testConnection(this.form)
        if (data) {
          this.$message.warn(data)
        } else {
          this.$message.success('连接成功')
        }
      }
    },
    // 数据源类型变换回调
    changeDatabaseType () {
      const e = this.form.databaseType
      this.form.dbDriver = databaseTypeMap[e]?.dbDriver
      this.form.dbUrl = databaseTypeMap[e]?.dbUrl
    },
    /**
     * 重置表单
     */
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
