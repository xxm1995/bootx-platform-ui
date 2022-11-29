<template>
  <a-modal
    :title="title"
    :width="modalWidth"
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
          <a-select v-model="form.databaseType" :disabled="showable">
            <a-select-option key="mysql">MySQL</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item
          label="驱动类"
          prop="dbDriver"
        >
          <a-input v-model="form.dbDriver" disabled/>
        </a-form-model-item>
        <a-form-model-item
          label="数据库地址"
          prop="dbUrl"
        >
          <a-input v-model="form.dbUrl" :disabled="showable" placeholder="请输入数据库地址"/>
        </a-form-model-item>
        <a-form-model-item
          label="数据库名称"
          prop="dbName"
        >
          <a-input v-model="form.dbName" :disabled="showable" placeholder="请输入数据库名称"/>
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
          <a-input v-model="form.dbPassword" :disabled="showable" placeholder="请输入数据库密码"/>
        </a-form-model-item>
        <a-form-model-item
          label="备注"
          prop="remark"
        >
          <a-textarea v-model="form.remark" :disabled="showable" placeholder="请输入备注"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { get, add, update } from '@/api/develop/dynamicDataSource'
export default {
  name: 'DynamicDataSourceEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        id: null,
        code: null,
        name: null,
        databaseType: 'mysql',
        dbDriver: 'com.mysql.cj.jdbc.Driver',
        dbUrl: null,
        dbName: null,
        dbUsername: null,
        dbPassword: null,
        remark: null
      },
      rules: {
        code: [ { required: true, message: '请输入' } ],
        name: [ { required: true, message: '请输入' } ],
        databaseType: [ { required: true, message: '请选择' } ],
        dbDriver: [ { required: true, message: '请输入' } ],
        dbUrl: [ { required: true, message: '请输入' } ],
        dbName: [ { required: true, message: '请输入' } ],
        dbUsername: [ { required: true, message: '请输入' } ],
        dbPassword: [ { required: true, message: '请输入' } ],
        remark: []
      }
    }
  },
  watch: {
    'form.databaseType': function (val) {
      console.log(val)
      switch (val) {
        case 'mysql': {
          this.form.dbDriver = 'com.mysql.cj.jdbc.Driver'
          break
        }
        default: {
          this.form.dbDriver = ''
        }
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
