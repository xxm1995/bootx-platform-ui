<template>
  <a-modal
    title="代码生成参数配置"
    :width="420"
    :visible="visible"
    :maskClosable="false"
    @cancel="handleCancel">
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        label="模块名称"
        prop="module">
        <a-input v-model="form.module"/>
      </a-form-model-item>
      <a-form-model-item
        label="实体类名称"
        prop="method">
        <a-input v-model="form.method"/>
      </a-form-model-item>
      <a-form-model-item
        label="创建人"
        prop="author">
        <a-input v-model="form.author"/>
      </a-form-model-item>
    </a-form-model>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" type="primary" @click="handleOk">生成</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  name: 'CodeGenForm',
  data () {
    return {
      visible: false,
      type: 'preview',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 17 }
      },
      form: {
        tableName: '',
        module: '',
        method: '',
        author: 'bootx'
      },
      rules: {
        module: [{ required: true, message: '请输入模块名称' }],
        method: [{ required: true, message: '请输入功能名称' }],
        author: [{ required: true, message: '请输入创建人' }]
      }
    }
  },
  methods: {
    // 打开
    show (tableName, type) {
      this.visible = true
      this.form.tableName = tableName
      this.type = type
    },
    // 确定
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          if (this.type === 'gen') {
            this.$emit('gen', this.form)
          } else {
            this.$emit('preview', this.form)
          }
          this.visible = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
