<template>
  <a-modal
    title="角色管理"
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
          label="角色名称"
          prop="name"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.name"
          />
        </a-form-model-item>
        <a-form-model-item
          label="角色代码"
          prop="code"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.code"
          />
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="description"
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
        >
          <a-input
            :disabled="showTable"
            v-model="form.description"
          />
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
  import { get, add, update } from '@/api/system/role'
  export default {
    name: 'RoleEdit',
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
          code: '',
          description: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入角色代码', trigger: 'blur' }
          ]
        },
        type: 'add',
        editable: false,
        addable: false,
        showTable: false,
        dsType: '2',
        treeData: []
      }
    },
    methods: {
      // 获取角色信息
      edit (id, type) {
        this.visible = true
        this.type = type
        if (type && type === 'add') {
          this.addable = true
          this.resetForm()
        }
        if (type === 'edit') {
          this.editable = true
        }
        if (type === 'show') {
          this.showTable = true
        }
        if (['edit', 'show'].includes(type)) {
          this.confirmLoading = true
          get(id).then(res => {
            const record = res.data
            this.dsType = record.dsType
            this.confirmLoading = false
            this.form = record
          })
        } else {
          this.dsType = '2'
        }
      },
      selectChange (e) {
        this.dsType = e
      },
      handleOk () {
        this.$refs.form.validate(async valid => {
          if (valid) {
            this.confirmLoading = true
            if (this.type === 'add') {
              await add(this.form)
            } else if (this.type === 'edit') {
              await update(this.form)
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
          this.showTable = false
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
