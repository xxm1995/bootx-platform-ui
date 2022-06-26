<template>
  <a-modal
    title="余额调整"
    destroyOnClose
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
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.walletId" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="名称"
          prop="amount"
        >
          <a-input-number
            :precision="2"
            :max="99999999999"
            :min="-99999999999"
            v-model="form.amount"
            placeholder="输入正数增加, 负数减少"
            style="width: 100%"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <template #footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button key="forward" :loading="confirmLoading" type="primary" @click="handleOk">提交</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { changerBalance } from '@/api/payment/wallet'

export default {
  name: 'WalletChanger',
  mixins: [FormMixin],
  data () {
    return {
      form: {
        walletId: null,
        amount: null
      },
      rules: {
        amount: [{ required: true, message: '请输入要调整的金额!' }]
      }
    }
  },
  methods: {
    edit (walletId) {
      this.confirmLoading = false
      this.form.walletId = walletId
      this.form.amount = null
    },
    handleOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.confirmLoading = true
          await changerBalance(this.form)
          this.visible = false
          this.$emit('ok')
        }
      })
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
