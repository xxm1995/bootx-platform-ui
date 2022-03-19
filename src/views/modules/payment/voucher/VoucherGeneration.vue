<template>
  <a-modal
    title="储值卡生成"
    :destroyOnClose="true"
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
          label="面值"
          prop="faceValue"
        >
          <a-input-number
            :precision="2"
            :max="9999999"
            :min="0.01"
            v-model="form.faceValue"
            placeholder="输入储值卡面值"
            style="width: 100%"/>
        </a-form-model-item>
        <a-form-model-item
          label="数量"
          prop="count"
        >
          <a-input-number
            :precision="0"
            :max="100"
            :min="1"
            v-model="form.count"
            placeholder="输入生成储值卡的数量"
            style="width: 100%"/>
        </a-form-model-item>
        <a-form-model-item
          label="有效期"
          prop="enduring"
        >
          <a-switch
            checkedChildren="长期"
            unCheckedChildren="期限"
            v-model="form.enduring"/>
        </a-form-model-item>
        <a-form-model-item
          label="有效期"
          prop="enduring"
          v-if="!form.enduring"
        >
          <a-range-picker
            valueFormat="yyyy-MM-DD"
            @change="changeTime"
          />
        </a-form-model-item>
        <a-form-model-item
          label="默认状态"
          prop="status"
        >
          <a-radio-group v-model="form.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="2">停用</a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">提交</a-button>
    </template>
  </a-modal>

</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { generationBatch } from '@/api/payment/voucher'

export default {
  name: 'VoucherGeneration',
  mixins: [FormMixin],
  computed: {
    rules () {
      return {
        count: [{ required: true, message: '请输入要生成的数量' }],
        faceValue: [{ required: true, message: '请输入储值卡的面值' }],
        enduring: [{ required: true, message: '请选择储值卡有效期类型' }],
        dataTime: [{ required: !this.enduring, message: '请选择有效时间范围' }],
        status: [{ required: true, message: '请选择默认状态' }]
      }
    }
  },
  data () {
    return {
      form: {
        count: 1,
        faceValue: 1,
        dataTime: null,
        enduring: true,
        startTime: null,
        endTime: null,
        status: 1
      }
    }
  },
  methods: {
    edit () {
      this.confirmLoading = false
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          this.form.dataTime = null
          if (this.form.enduring) {
            this.form.startTime = null
            this.form.endTime = null
          }
          await generationBatch(this.form)
          this.visible = false
          this.$emit('ok')
        }
      })
    },
    // 时间范围变动
    changeTime (_, times) {
      console.log(_, times)
      this.form.startTime = times[0] + ' 00:00:00'
      this.form.endTime = times[1] + ' 23:59:59'
    },
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
