<template>
  <a-card :bordered="false">
    <div>
      <h1 style="display: flex">{{ title }}</h1>
      <vue-qr
        :size="250"
        :margin="0"
        :auto-color="true"
        :dot-scale="1"
        :text="payUrl" />
      <a-divider />
      <div>
        <a-form-model
          ref="form"
          :model="form"
          :rules="rules"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
        >
          <a-form-model-item label="支付方式" prop="payChannel">
            <a-radio-group v-model="form.payChannel" default-value="alipay" button-style="solid">
              <a-radio-button value="alipay">
                支付宝
              </a-radio-button>
              <a-radio-button value="wechat">
                微信
              </a-radio-button>
              <a-radio-button value="unionpay">
                云闪付
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="订单编号" prop="businessId">
            <a-input v-model="form.businessId" />
          </a-form-model-item>
          <a-form-model-item label="订单名称" prop="title">
            <a-input v-model="form.title" />
          </a-form-model-item>
          <a-form-model-item label="金额" prop="amount">
            <a-input v-model="form.amount" />
          </a-form-model-item>
        </a-form-model>
      </div>
      <a-button type="primary" @click="payOk">
        支付
      </a-button>
    </div>
  </a-card>
</template>

<script>
import VueQr from 'vue-qr'

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
      title: '扫码支付',
      logoSrc: '',
      form: {
        payChannel: 'alipay',
        businessId: '',
        title: '测试支付订单',
        payWay: 4,
        amount: 0.01
      },
      rules: {
      },
      payUrl: 'http://www.baidu.com' // 根据url生成二维码
    }
  },
  methods: {
    payOk () {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const param = {
            businessId: this.businessId,
            totalMoney: this.totalMoney,
            currentActive: this.currentActive,
            title: '测试支付'
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.cashier{
  display: flex;
}
</style>
