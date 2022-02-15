<template>
  <a-modal
    :title="title"
    :width="740"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        label="文件"
        prop="file"
      >
        <a-upload :multiple="false" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
          <a-button> <a-icon type="upload" /> Select File </a-button>
        </a-upload>
      </a-form-model-item>
      <a-form-model-item
        label="文件名"
        prop="fileName"
      >
        <a-input v-model="form.fileName" :disabled="showable"/>
      </a-form-model-item>
    </a-form-model>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, get, judgeJobClass, update } from '@/api/starter/quartz'

export default {
  name: 'FileUploadEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        fileName: '',
        file: { }
      },
      rules: {
        name: [{ required: true, message: '请输入任务名称' }],
        jobClassName: [{ required: true, message: '请输入任务类名' }],
        cron: [{ required: true, message: '请输入cron' }]
      }
    }
  },
  methods: {
    edit (id, type) {
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.confirmLoading = false
        })
      } else {
        this.confirmLoading = false
      }
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
    resetForm () {
      this.$nextTick(() => {
        this.$refs.form.resetFields()
      })
    },
    judgeJobClass (clazz) {
      judgeJobClass(clazz).then(() => {
      })
    }
  }
}
</script>

<style scoped>

</style>
