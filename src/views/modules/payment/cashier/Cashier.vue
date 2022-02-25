<template>
  <a-card :bordered="false">
    <a-modal
      title="扫码支付"
      :footer="null"
      :width="300"
      :visible="visible"
      :maskClosable="false"
      @cancel="handleCancel"
    >
      <a-spin :spinning="loading">
        <vue-qr
          :size="250"
          :margin="0"
          :auto-color="true"
          :dot-scale="1"
          :text="payUrl" />
      </a-spin>
    </a-modal>
    <div>
      <div>
        <a-form-model
          ref="form"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="支付方式" prop="payChannel">
            <a-radio-group v-model="form.payChannel" :default-value="1" button-style="solid">
              <a-radio-button :value="1">
                支付宝
              </a-radio-button>
              <a-radio-button :value="2">
                微信
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="订单编号" prop="businessId">
            <a-input-search v-model="form.businessId" @search="genOrderNo">
              <template v-slot:enterButton>
                <a-button>
                  生成订单号
                </a-button>
              </template>
            </a-input-search>
          </a-form-model-item>
          <a-form-model-item label="订单名称" prop="title">
            <a-input v-model="form.title" />
          </a-form-model-item>
          <a-form-model-item label="金额" prop="amount">
            <a-input-number :precision="2" v-model="form.amount" />
          </a-form-model-item>
        </a-form-model>
      </div>
      <a-button type="primary" @click="pay">
        发起支付
      </a-button>
    </div>
  </a-card>
</template>

<script>
import VueQr from 'vue-qr'
import { pay } from '@/api/payment/cashier'

export default {
  name: 'Cashier',
  components: {
    VueQr
  },
  data () {
    return {
      labelCol: {
        sm: { span: 7 }
      },
      wrapperCol: {
        sm: { span: 13 }
      },
      loading: false,
      visible: false,
      title: '扫码支付',
      form: {
        payChannel: 1,
        payWay: 4,
        businessId: '',
        title: '测试支付订单',
        // 二维码支付方式
        amount: 0.01
      },
      rules: {
        payChannel: [{ required: true, message: '不可为空' }],
        businessId: [{ required: true, message: '不可为空' }],
        title: [{ required: true, message: '不可为空' }],
        payWay: [{ required: true, message: '不可为空' }],
        amount: [{ required: true, message: '不可为空' }]
      },
      payUrl: ''
    }
  },
  methods: {
    // 初始化
    init () {
      this.genOrderNo()
    },
    // 生成订单号
    genOrderNo () {
      this.form.businessId = 'P' + new Date().getTime()
    },
    pay () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          this.visible = true
          pay(this.form).then(res => {
            this.payUrl = res.data
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.loading = false
      this.genOrderNo()
      this.payUrl = ''
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
.cashier{
  display: flex;
}
</style>
