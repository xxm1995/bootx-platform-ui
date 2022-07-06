<template>
  <a-modal
    :title="title"
    :width="modalWidth"
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
        <a-input v-model="form.name" placeholder="请输入任务名称" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="任务类名"
        prop="jobClassName"
      >
        <a-input v-model="form.jobClassName" placeholder="请输入任务类名" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="cron"
        prop="cron"
      >
        <a-input v-model="form.cron" placeholder="请选择cron表达式" :disabled="true">
          <template #addonAfter>
            <a @click="showCronModal" class="config-btn" :disabled="showable">
              <a-icon type="setting"></a-icon>
              选择
            </a>
          </template>
        </a-input>
      </a-form-model-item>
      <a-form-model-item
        label="状态"
        v-show="showable"
      >
        <a-tag v-if="form.state===1" color="green">运行</a-tag>
        <a-tag v-else color="red">停止</a-tag>
      </a-form-model-item>
      <a-form-model-item
        label="参数"
        prop="parameter"
      >
        <a-textarea v-model="form.parameter" placeholder="请输入参数" :disabled="showable"/>
      </a-form-model-item>
      <a-form-model-item
        label="备注"
        prop="remark"
      >
        <a-textarea v-model="form.remark" placeholder="请输入备注" :disabled="showable"/>
      </a-form-model-item>
    </a-form-model>

    <a-modal
      :visible="cronShow"
      title="Cron表达式"
      :width="modalWidth"
      @ok="cronOk"
      @cancel="cronCancel"
      destroyOnClose>
      <easy-cron
        v-model="cronValue"
        :hideYear="false"
        :hideSecond="false"
        style="width: 100%"
      />
    </a-modal>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import EasyCron from '@/components/EasyCron/EasyCron'
import { add, get, judgeJobClass, update } from '@/api/starter/quartz'

export default {
  name: 'QuartzJobEdit',
  mixins: [FormMixin],
  components: { EasyCron },
  data () {
    return {
      modalWidth: 740,
      cronShow: false,
      cronValue: null,
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
        cron: [{ required: true, message: '请输入或选择cron' }]
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
    /**
     * 判断是否是任务类
     */
    async validateJobClass (rule, value, callback) {
      const res = await judgeJobClass(value)
      if (!res.data) {
        callback()
      } else {
        callback(res.data)
      }
    },
    /**
     * 显示出来选择Cron窗口
     */
    showCronModal () {
      this.cronShow = true
      this.cronValue = this.form.cron
    },
    /**
     * cron 确认回调
     */
    cronOk () {
      this.form.cron = this.cronValue
      this.cronCancel()
    },
    /**
     * cron 关闭回调
     */
    cronCancel () {
      this.$refs.form.validateField(['cron'])
      this.cronShow = false
    }
  }
}
</script>

<style scoped>

</style>
