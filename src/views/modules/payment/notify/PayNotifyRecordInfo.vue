<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-descriptions
      title=""
      :column="{md: 1, sm: 1, xs: 1}"
    >
      <a-descriptions-item label="业务id">
        {{ form.paymentId }}
      </a-descriptions-item>
      <a-descriptions-item label="支付通道">
        {{ dictConvert('PayChannel',form.payChannel) }}
      </a-descriptions-item>
      <a-descriptions-item label="通知消息">
        {{ form.notifyInfo }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ form.status === 1 ? '成功':'失败' }}
      </a-descriptions-item>
      <a-descriptions-item label="提示消息">
        {{ form.msg }}
      </a-descriptions-item>
      <a-descriptions-item label="通知时间">
        {{ form.notifyTime }}
      </a-descriptions-item>

    </a-descriptions>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
  import { FormMixin } from '@/mixins/FormMixin'
  import { get, add, update } from '@/api/payment/payNotifyRecord'
  export default {
    name: 'PayNotifyRecordInfo',
    mixins: [FormMixin],
    data () {
      return {
        form: {
          id: null,
          paymentId: '',
          notifyInfo: '',
          payChannel: '',
          status: '',
          msg: '',
          notifyTime: ''
        },
        rules: {

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
      }
    }
  }
</script>

<style scoped>
</style>
