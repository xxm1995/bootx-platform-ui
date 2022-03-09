<template>
  <div style="background-color: #F5F5F7;">
    <div class="page paydemo">
      <div class="blog-container" id="container" style="margin-top: 80px">
        <a-spin :spinning="loading">
          <div class="content" style="padding-top: 30px">
            <div style="width: 100%;">
              <div class="paydemo-type-content">
                <div class="paydemo-type-name">微信支付</div>
                <div class="paydemo-type-body">
                  <div v-for="item in WxPayList" :key="item.payInfo.payWay" @click="handleActive(item.payInfo)">
                    <div :class="item.payInfo === currentActive?'colorChange':'paydemoType'">
                      <img :src="item.img" class="paydemo-type-img">
                      <span class="color-change">{{ item.title }}</span>
                    </div>
                  </div>
                  <div style="position: relative">
                    <div class="paydemo-type-h5" code="WECHAT_H5" @click="handleActive('WECHAT_H5')" @mouseover="wxHover = true" @mouseleave="wxHover = false">
                      <img src="./imgs/wechat/wx_h5.svg" class="paydemo-type-img">
                      <span>微信H5</span>
                    </div>
                    <div class="paydemo-type-h5 layui-hide codeImg_wx_h5" v-if="this.wxHover">
                      <vue-qr
                        :size="120"
                        :margin="0"
                        :auto-color="true"
                        :dot-scale="1"
                        :text="wxH5Url" />
                      <span style="margin-top: 10px">请使用手机浏览器扫码</span>
                    </div>
                  </div>
                </div>
                <div class="paydemo-type-name">支付宝支付</div>
                <div class="paydemo-type-body">
                  <div v-for="item in AliPayList" :key="item.payInfo.payWay" @click="handleActive(item.payInfo)">
                    <div :class="item.payInfo===currentActive?'colorChange':'paydemoType'">
                      <img :src="item.img" class="paydemo-type-img">
                      <span class="color-change">{{ item.title }}</span>
                    </div>
                  </div>
                  <div style="position: relative">
                    <div class="paydemo-type-h5" code="ALI_WAP" @mouseover="aliHover = true" @mouseleave="aliHover = false">
                      <img src="./imgs/ali/ali_wap.svg" class="paydemo-type-img"/>
                      <span>支付宝WAP</span>
                    </div>
                    <div class="paydemo-type-h5 layui-hide codeImg_wx_h5" v-if="this.aliHover">
                      <vue-qr
                        :size="120"
                        :margin="0"
                        :auto-color="true"
                        :dot-scale="1"
                        :text="wxH5Url" />
                      <span style="margin-top: 10px">请使用手机浏览器扫码</span>
                    </div>
                  </div>
                </div>

                <div class="paydemo-type-name">聚合支付</div>
                <div class="paydemo-type-body">
                  <div v-for="item in aggregationPayList" :key="item.payInfo.payWay" @click="handleActive(item.payInfo)">
                    <div :class="item.payInfo===currentActive?'colorChange':'paydemoType'">
                      <img :src="item.img" class="paydemo-type-img"/>
                      <span class="color-change">{{ item.title }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="paydemo-type-content">
                <div class="paydemo-type-name">支付信息</div>
                <a-form class="layui-form">
                  <div class="paydemo-form-item">
                    <label>业务单号：</label>
                    <span>
                      <a-input v-model="businessId"/>
                    </span>
                    <span
                      id="randomOrderNo"
                      class="layui-btn layui-btn-xs paydemo-btn"
                      @click="refreshBusinessId">刷新订单号</span>
                  </div>
                  <div class="paydemo-form-item">
                    <label>支付标题：</label>
                    <span >
                      <a-input style="width: 300px" v-model="title"/>
                    </span>
                  </div>
                  <div class="paydemo-form-item">
                    <label>支付金额(元)：</label>
                    <a-radio-group v-model="payMoneyValue" @change="payMoneyValueChange">
                      <a-radio :value="item.value" v-for="(item,index) in payMoneyList" :key="index">
                        {{ item.label }}
                      </a-radio>
                    </a-radio-group>
                  </div>
                  <div style="margin-top:20px;text-align: right">
                    <span style="color: #FD482C;font-size: 18px;padding-right: 10px;" >{{ '¥ '+totalMoney }}</span>
                    <a-button type="primary" :disabled="currentActive.payWay == null" @click="pay">立即支付</a-button>
                  </div>
                </a-form>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <!--  条码支付弹框-->
      <cashier-qr-code
        ref="cashierQrCode"
        @cancel="handleCancel"/>
      <!--   扫码弹出窗口   -->
      <cashier-bar-code
        ref="cashierBarCode"
        @cancel="handleCancel"
        @ok="barPay"/>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import CashierQrCode from './CashierQrCode'
import CashierBarCode from './CashierBarCode'
import { singlePay } from '@/api/payment/cashier'
import { createAggregatePay } from '@/api/payment/aggregate'
import { findStatusByBusinessId } from '@/api/payment/payment'
import { findByParamKey } from '@/api/system/param'

export default {
  name: 'Cashier',
  components: {
    VueQr,
    CashierQrCode,
    CashierBarCode
  },
  data () {
    return {
      businessId: '', // 业务单号
      title: '测试支付',
      loading: false,
      wxH5Url: 'cs',
      aliWapUrl: 'cs',
      wxHover: false, // 微信 hover 状态
      aliHover: false, // 支付宝 hover 状态
      barVisible: false, // 条码支付弹框
      currentActive: { // 当前选择支付渠道和方式
        payChannel: null,
        payWay: null
      },
      AliPayList: [
        { img: require('./imgs/ali/ali_qr.svg'), title: '支付宝二维码', payInfo: { payChannel: 1, payWay: 4 } },
        { img: require('./imgs/ali/ali_bar.svg'), title: '支付宝条码', payInfo: { payChannel: 1, payWay: 5 } },
        { img: require('./imgs/ali/ali_pc.svg'), title: '支付宝PC网站', payInfo: { payChannel: 1, payWay: 3 } },
        { img: require('./imgs/ali/ali_wap.svg'), title: '支付宝wap支付', payInfo: { payChannel: 1, payWay: 1 } }
      ],
      WxPayList: [
        { img: require('./imgs/wechat/wx_native.svg'), title: '微信二维码', payInfo: { payChannel: 2, payWay: 4 } },
        { img: require('./imgs/wechat/wx_bar.svg'), title: '微信条码', payInfo: { payChannel: 2, payWay: 5 } }
        // { img: require('./imgs/wechat/wx_jsapi.svg'), title: '公众号/小程序', payInfo: { payChannel: 2, payWay: 23 } }
      ],
      aggregationPayList: [
        { img: require('./imgs/qr/qr_cashier.svg'), title: '聚合扫码(用户扫商家)', payInfo: { payChannel: 99, payWay: 4 } },
        { img: require('./imgs/qr/auto_bar.svg'), title: '聚合条码(商家扫用户)', payInfo: { payChannel: 99, payWay: 5 } }
      ],
      payMoneyList: [ // 支付金额列表
        { label: '0.01', value: 0.01 },
        { label: '1.01', value: 1.01 },
        { label: '9.99', value: 9.99 },
        { label: '99.99', value: 99.99 },
        { label: '2500', value: 2500 }
      ],
      payMoneyValue: 0.01,
      totalMoney: 0.01,
      payMoneyShow: false,
      // 定时查询支付状态定时器
      interval: null
    }
  },
  methods: {
    // 支付金额变动
    payMoneyValueChange (e) {
      this.totalMoney = null
      if (e.target.value === '6') {
        this.payMoneyShow = true
      } else {
        this.totalMoney = e.target.value
        this.payMoneyShow = false
      }
    },
    // 发起支付
    pay () {
      const { payChannel, payWay } = this.currentActive
      // 聚合扫码
      if (payChannel === 99 && payWay === 4) {
        this.aggregationQr()
      } else if (payChannel === 99 && payWay === 5) { // 聚合条码
        this.$refs.cashierBarCode.init('请输入支付宝、微信条码')
      } else { // 普通支付
        // 付款码
        if (payWay === 5) {
          this.$refs.cashierBarCode.init(payChannel === 1 ? '请输入支付宝条码' : '请输入微信条码')
        } else {
          this.qrPay(payChannel, payWay)
        }
      }
    },
    // 扫码支付
    async qrPay (payChannel, payWay) {
      const param = {
        businessId: this.businessId,
        amount: this.totalMoney,
        title: this.title,
        payChannel,
        payWay
      }
      // 接受结果
      this.loading = true
      const { data } = await singlePay(param).catch(_ => this.loading = false)
      this.loading = false
      // pc支付
      if ([1, 3].includes(payWay)) {
        window.open(data.syncPayInfo.payBody)
      } else if (payChannel === 1) {
        this.$refs.cashierQrCode.init(data.syncPayInfo.payBody, '请使用支付宝"扫一扫"扫码支付')
        this.checkPayStatus()
      } else {
        this.$refs.cashierQrCode.init(data.syncPayInfo.payBody, '请使用微信"扫一扫"扫码支付')
        this.checkPayStatus()
      }
    },
    // 聚合扫码
    async aggregationQr () {
      const param = {
        businessId: this.businessId,
        amount: this.totalMoney,
        title: this.title
      }
      // 获取聚合支付的地址
      const { data: qrUrlPrefix } = await findByParamKey('CashierAggregateUrl')
      // 获取聚合支付的标识key
      const { data: qrKey } = await createAggregatePay(param)
      // 发起支付
      const qrUrl = qrUrlPrefix + qrKey
      this.$refs.cashierQrCode.init(qrUrl, '请使用支付宝或微信"扫一扫"扫码支付')
      this.checkPayStatus()
    },
    // 条码支付
    barPay (authCode) {
      const { payChannel, payWay } = this.currentActive
      const param = {
        businessId: this.businessId,
        amount: this.totalMoney,
        title: this.title,
        authCode,
        payChannel,
        payWay
      }
      singlePay(param).then(_ => {
        this.checkPayStatus()
      })
    },
    // 生成业务id
    refreshBusinessId () {
      this.businessId = 'P' + new Date().getTime()
    },
    // 当前选择的支付类型
    handleActive (payInfo) {
      this.currentActive = payInfo
    },
    // 关闭
    handleCancel () {
      this.$refs.cashierQrCode.handleClose()
      this.$refs.cashierBarCode.handleClose()
      this.refreshBusinessId()
      clearInterval(this.interval)
      this.interval = null
    },
    // 检查支付状态
    checkPayStatus () {
      this.interval = setInterval(() => {
        findStatusByBusinessId(this.businessId).then(res => {
          // 成功
          if (res.data === 1) {
            this.$message.success('支付成功')
            this.handleCancel()
          }
          if ([2, 3].includes(res.data)) {
            this.$message.error('支付失败')
            this.handleCancel()
          }
        })
      }, 1000 * 3)
    }
  },
  created () {
    this.refreshBusinessId()
  }
}
</script>

<style scoped lang="less">
@import "style.less";
</style>
