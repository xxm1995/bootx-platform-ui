<template>
  <div style="background-color: #F5F5F7;">
    <div class="page paydemo">
      <div class="blog-container" id="container" style="margin-top: 80px">
        <div class="content" style="padding-top: 30px">
          <div style="width: 100%;">
            <div class="paydemo-type-content">
              <div class="paydemo-type-name">微信支付</div>
              <div class="paydemo-type-body">
                <div v-for="item in WxPayList" :key="item.id" @click="handleActive(item.code)">
                  <div :class="item.code === currentActive?'colorChange':'paydemoType'" :code="item.code">
                    <img :src="item.img" class="paydemo-type-img">
                    <span class="color-change">{{ item.title }}</span>
                  </div>
                </div>
                <div style="position: relative">
                  <div class="paydemo-type-h5" code="WECHAT_H5" @click="handleActive('WECHAT_H5')" @mouseover="hover = true" @mouseleave="hover = false">
                    <img src="./imgs/wechat/wx_h5.svg" class="paydemo-type-img">
                    <span>微信H5</span>
                  </div>
                  <div class="paydemo-type-h5 layui-hide codeImg_wx_h5" v-if="this.hover">
                    <img style="width: 120px;height: 120px;padding-bottom: 10px" src="./imgs/wechat/w_pay.png">
                    <span >请使用手机浏览器扫码</span>
                  </div>
                </div>
              </div>
              <div class="paydemo-type-name">支付宝支付</div>
              <div class="paydemo-type-body">
                <div v-for="item in AliPayList" :key="item.id" @click="handleActive(item.code)">
                  <div :class="item.code===currentActive?'colorChange':'paydemoType'" :code="item.code">
                    <img :src="item.img" class="paydemo-type-img">
                    <span class="color-change">{{ item.title }}</span>
                  </div>
                </div>
                <div style="position: relative">
                  <div class="paydemo-type-h5" code="ALI_WAP" @click="handleActive('ALI_WAP')" @mouseover="alihover = true" @mouseleave="alihover = false">
                    <img src="./imgs/ali/ali_wap.svg" class="paydemo-type-img"/>
                    <span>支付宝WAP</span>
                  </div>
                  <div class="paydemo-type-h5 layui-hide codeImg_wx_h5" v-if="this.alihover">
                    <img style="width: 120px;height: 120px;padding-bottom: 10px" src="./imgs/wechat/w_pay.png"/>
                    <span >请使用手机浏览器扫码</span>
                  </div>
                </div>
              </div>

              <div class="paydemo-type-name">聚合支付</div>
              <div class="paydemo-type-body">
                <div v-for="item in aggregationPayList" :key="item.id" @click="handleActive(item.code)">
                  <div :class="item.code===currentActive?'colorChange':'paydemoType'" :code="item.code">
                    <img :src="item.img" class="paydemo-type-img"/>
                    <span class="color-change">{{ item.title }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="paydemo-type-content">
              <div class="paydemo-type-name">支付信息</div>
              <form class="layui-form">
                <div class="paydemo-form-item">
                  <label>业务单号：</label><span >{{ businessId }}</span>
                  <span
                    id="randomOrderNo"
                    class="layui-btn layui-btn-xs paydemo-btn"
                    @click="refreshBusinessId">刷新订单号</span>
                </div>
                <div class="paydemo-form-item">
                  <label>支付标题：</label>
                  <span >
                    测试支付商品
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
                  <button class="layui-btn" lay-submit lay-filter="payTest" style="background-color: #1953ff;border-radius: 5px;" @click="pay">立即支付</button>
                </div>
              </form>
            </div>
          </div>
          <div class="paydemo-type-content" style="background-color: #ffffff">
            <div class="paydemo-type-name">
              <span>最新支付</span>
              <button
                class="layui-btn layui-btn-xs paydemo-btn"
                style="margin-top: 3px"
                @click="refreshOrder">刷新</button>
            </div>
            <a-table
              :columns="table.columns"
              :dataSource="table.data"
              :loading="table.loading"
              :rowKey="record => record.userId"
              :pagination="true"
            >
              <span slot="status" slot-scope="text,record">
                <a-tag color="blue" v-if="record.status==='1'">待支付</a-tag>
                <a-tag color="green" v-if="record.status==='2'">已支付</a-tag>
                <a-tag color="orange" v-if="record.status==='3'">已取消</a-tag>
              </span>
            </a-table>
          </div>
        </div>
      </div>
      <!--  条码支付弹框-->
      <cashier-qr-code
        ref="cashierQrCode"
        @cancel="refreshBusinessId"/>
      <!--   扫码弹出窗口   -->
      <a-modal
        v-model="qrVisible"
        title="扫码支付"
        @cancel="()=>{this.qrVisible = false;this.refreshBusinessId()}"
        :footer="null"
        :width="350">
        <div style="display: flex; flex-direction: column;align-items: center;">
          <vue-qr
            :size="190"
            :margin="0"
            :auto-color="true"
            :dot-scale="1"
            :text="payUrl" />
          <div style="padding-top: 20px;  display: flex; flex-direction: row;align-items: center;justify-content: center;">
            <img style="width: 25px;padding-right: 5px;" :src="icon" />
            <img v-if="this.currentActive === 'QR_CASHIER'" style="width: 25px;padding-right: 5px;" :src="icon_j" />
            {{ bottomTitle }}
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import CashierQrCode from './CashierQrCode'
import CashierBarCode from './CashierBarCode'
import { barCodePay, qrCodePay } from '@/api/demo/demo'

export default {
  name: 'Cashier',
  components: {
    VueQr,
    CashierQrCode,
    CashierBarCode
  },
  data () {
    return {
      businessId: 'M16258375660088878', // 业务单号
      barPayCode: '',
      paySubject: '', // 支付备注
      logoSrc: '',
      payUrl: 'http://www.baidu.com', // 根据url生成二维码
      moneyConfirm: false, // 输入的金额不符合条件的弹框
      hover: false,
      alihover: false,
      barVisible: false, // 条码支付弹框
      qrVisible: false, // 扫码支付弹框
      contentTitle: '', // 弹框支付标题
      bottomTitle: '', // 请使用微信"扫一扫"扫码支付
      payCoding: '',
      icon: '',
      icon_j: '',
      currentActive: 'WECHAT_QRCODE', // 当前点击
      WxPayList: [
        { img: require('./imgs/wechat/wx_native.svg'), title: '微信二维码', code: 'WECHAT_QRCODE' },
        { img: require('./imgs/wechat/wx_bar.svg'), title: '微信条码', code: 'WECHAT_BAR' },
        { img: require('./imgs/wechat/wx_jsapi.svg'), title: '公众号/小程序', code: 'WECHAT_QRCODE_CASHIER' }
      ],
      AliPayList: [
        { img: require('./imgs/ali/ali_qr.svg'), title: '支付宝二维码', code: 'ALI_QRCODE' },
        { img: require('./imgs/ali/ali_bar.svg'), title: '支付宝条码', code: 'ALI_BAR' },
        // { img: require('./imgs/ali/ali_jsapi.svg'), title: '支付宝生活号', code: 'ALI_QRCODE_CASHIER' },
        { img: require('./imgs/ali/ali_pc.svg'), title: '支付宝PC网站', code: 'ALI_PC' }
      ],
      aggregationPayList: [
        { img: require('./imgs/qr/qr_cashier.svg'), title: '聚合扫码(用户扫商家)', code: 'QR_CASHIER' },
        { img: require('./imgs/qr/auto_bar.svg'), title: '聚合条码(商家扫用户)', code: 'AUTO_BAR' }
      ],
      payMoneyList: [ // 支付金额列表
        {
          label: '0.01',
          value: 0.01
        },
        {
          label: '0.1',
          value: 0.1
        },
        {
          label: '1.00',
          value: 1
        },
        {
          label: '5.00',
          value: 5
        },
        {
          label: '10.00',
          value: 10
        }
      ],
      payMoneyValue: 0.01,
      totalMoney: 0.01,
      payMoneyShow: false,
      table: {
        data: [
          {
            businessId: '001',
            money: '0.01',
            payChannel: '支付宝',
            payWay: '扫码支付',
            status: '3',
            createdTime: '2021-07-09 13:09:01'
          },
          {
            businessId: '002',
            money: '0.1',
            payChannel: '支付宝',
            payWay: '扫码支付',
            status: '1',
            createdTime: '2021-06-09 13:09:01'
          }, {
            businessId: '003',
            money: '10',
            payChannel: '微信',
            payWay: '付款码支付',
            status: '2',
            createdTime: '2021-05-09 13:09:01'
          }, {
            businessId: '004',
            money: '0.1',
            payChannel: '微信',
            payWay: '扫码支付',
            status: '3',
            createdTime: '2021-01-09 13:09:01'
          }, {
            businessId: '005',
            money: '1',
            payChannel: '支付宝',
            payWay: '付款码支付',
            status: '1',
            createdTime: '2021-04-09 13:09:01'
          }
        ],
        loading: false,
        columns: [
          {
            title: '业务编号',
            dataIndex: 'businessId'
          },
          {
            title: '支付金额',
            dataIndex: 'money'
          },
          {
            title: '支付渠道',
            dataIndex: 'payChannel'
          },
          {
            title: '支付方式',
            dataIndex: 'payWay'
          },
          {
            title: '支付状态',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '创建时间',
            dataIndex: 'createdTime'
          }
        ]
      },
      page: {
        index: 1,
        size: 10,
        total: 0
      }
    }
  },
  methods: {
    // 刷新订单列表
    refreshOrder () {
      console.log('刷新')
    },
    // 判断自定义金额
    payMoneyValueChange (e) {
      this.totalMoney = null
      // eslint-disable-next-line eqeqeq
      if (e.target.value === '6') {
        this.payMoneyShow = true
      } else {
        this.totalMoney = e.target.value
        this.payMoneyShow = false
      }
    },
    // 立即支付
    pay () {
      if (this.currentActive === 'WECHAT_BAR') { // 微信条码
        this.contentTitle = '请输入微信条码'
        this.barVisible = true
        this.barPayCode = ''
      } else if (this.currentActive === 'ALI_BAR') { // 支付宝条码
        this.contentTitle = '请输入支付宝条码'
        this.barVisible = true
        this.barPayCode = ''
      } else if (this.currentActive === 'AUTO_BAR') { // 聚合
        this.contentTitle = '请输入微信或支付宝条码'
        this.barVisible = true
        this.barPayCode = ''
      } else if (this.currentActive === 'WECHAT_QRCODE' || this.currentActive === 'WECHAT_QRCODE_CASHIER') { // 微信二维码、公众号、小程序
        this.payCoding = require('./imgs/wechat/w_pay.png')
        // 获取微信支付二维码、的url
        this.icon = require('./imgs/wechat/wx_app.svg')
        this.bottomTitle = '请使用微信"扫一扫"扫码支付'
        this.qrPay()
      } else if (this.currentActive === 'ALI_QRCODE' || this.currentActive === 'ALI_QRCODE_CASHIER') { // 支付宝二维码、支付宝生活号
        this.payCoding = require('./imgs/wechat/w_pay.png')
        // 获取支付宝支付二维码、的url
        this.icon = require('./imgs/ali/ali_app.svg')
        this.bottomTitle = '请使用支付宝"扫一扫"扫码支付'
        this.qrPay()
      } else if (this.currentActive === 'QR_CASHIER') { // 聚合
        this.payCoding = require('./imgs/wechat/w_pay.png')
        // 获取微信，支付宝支付二维码、的url
        this.icon = require('./imgs/wechat/wx_app.svg')
        this.icon_j = require('./imgs/ali/ali_app.svg')
        this.bottomTitle = '支持微信、支付宝扫码'
        this.qrPay()
      }
    },

    // 扫码支付
    qrPay () {
      const param = {
        businessId: this.businessId,
        totalMoney: this.totalMoney,
        currentActive: this.currentActive,
        title: '测试支付'
      }
      qrCodePay(param).then(result => {
        this.payUrl = result.data
        this.qrVisible = true
      })
    },
    // 条码支付
    barPay () {
      const param = {
        businessId: this.businessId,
        totalMoney: this.totalMoney,
        currentActive: this.currentActive,
        barPayCode: this.barPayCode,
        title: '测试支付'
      }
      barCodePay(param).then(result => {
        const data = result.data
        console.log(data)
      })
    },
    // 聚合扫码
    aggregationQr () {

    },
    // 生成业务id
    refreshBusinessId () {
      this.businessId = 'P' + new Date().getTime()
    },
    // 当前选择的支付类型
    handleActive (index) {
      this.currentActive = index
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
