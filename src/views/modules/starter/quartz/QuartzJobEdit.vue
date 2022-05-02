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
      <a-form-model-item label="主键" prop="id" :hidden="true" >
        <a-input v-model="form.id" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="任务名称"
        prop="name"
      >
        <a-input v-model="form.name" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="任务类名"
        prop="jobClassName"
      >
        <a-input v-model="form.jobClassName" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="cron"
        prop="cron"
      >
        <a-input v-model="form.cron" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="state"
        v-show="showable"
      >
        <a-tag v-if="form.state===1">启动</a-tag>
        <a-tag v-else>停止</a-tag>
      </a-form-model-item>
      <a-form-model-item
        label="参数"
        prop="parameter"
      >
        <a-textarea v-model="form.parameter" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="备注"
        prop="remark"
      >
        <a-textarea v-model="form.remark" :disabled="showable"/>
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
  name: 'QuartzJobEdit',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        name: '',
        jobClassName: '',
        cron: '',
        parameter: null,
        state: null,
        remark: null
      },
      rules: {
        name: [{ required: true, message: '请输入任务名称' }],
        jobClassName: [
          { required: true, message: '请输入任务类名' },
          { validator: this.validateJobClass, trigger: 'blur' }
        ],
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
    // 判断是否是任务类
    async validateJobClass (rule, value, callback) {
      const res = await judgeJobClass(value)
      if (!res.data) {
        callback()
      } else {
        callback(res.data)
      }
    }
  }
}
</script>

<style scoped>

</style>
