<template>
  <a-drawer
    :title="title"
    :width="modalWidth"
    :mask-closable="showable"
    @close="handleCancel"
    :visible="visible"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading" style="margin-bottom: 3rem">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item prop="id" hidden="true">
          <a-input disabled v-model="form.id"/>
        </a-form-model-item>
        <a-form-model-item label="名称" prop="name" >
          <a-input :disabled="showable" v-model="form.name" placeholder="请输入名称"/>
        </a-form-model-item>
        <a-form-model-item label="AppId" prop="appId" >
          <a-input :disabled="showable" v-model="form.appId" placeholder="请输入AppId"/>
        </a-form-model-item>
        <a-form-model-item label="异步通知URL" prop="notifyUrl" >
          <a-input :disabled="showable" v-model="form.notifyUrl" placeholder="请输入异步通知URL"/>
        </a-form-model-item>
        <a-form-model-item label="同步通知URL" prop="returnUrl" >
          <a-input :disabled="showable" v-model="form.returnUrl" placeholder="请输入同步通知URL"/>
        </a-form-model-item>
        <a-form-model-item label="支付网关URL" prop="serverUrl" >
          <a-input :disabled="showable" v-model="form.serverUrl" placeholder="请输入支付网关URL"/>
        </a-form-model-item>
        <a-form-model-item label="默认支付超时配置(分钟)" prop="expireTime" >
          <a-input-number
            :min="1"
            :max="12000"
            :step="1"
            :disabled="showable"
            placeholder="请输入超时配置"
            v-model="form.expireTime"/>
        </a-form-model-item>
        <a-form-model-item label="支持支付方式" prop="payWayList">
          <a-select
            allowClear
            mode="multiple"
            :disabled="showable"
            v-model="form.payWayList"
            :default-value="form.payWayList"
            style="width: 100%"
            placeholder="选择支付方式"
          >
            <a-select-option v-for="o in payWayList" :key="o.key">
              {{ o.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="沙箱环境" prop="sandbox" >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.sandbox" :disabled="showable" />
        </a-form-model-item>
        <a-form-model-item v-show="showable" label="是否启用" prop="activity" >
          <a-tag>{{ form.activity?"启用":"未启用" }}</a-tag>
        </a-form-model-item>
        <a-form-model-item label="认证方式" prop="authType" >
          <a-select
            allowClear
            :disabled="showable"
            v-model="form.authType"
            :default-value="form.authType"
            style="width: 100%"
            placeholder="选择认证方式"
          >
            <a-select-option :key="1">公钥模式</a-select-option>
            <a-select-option :key="2">证书模式</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="签名类型" prop="signType" >
          <a-select
            allowClear
            :disabled="showable"
            v-model="form.signType"
            :default-value="form.signType"
            style="width: 100%"
            placeholder="选择签名类型"
          >
            <a-select-option key="RSA2">RSA2秘钥</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item v-show="form.authType === 1" label="支付宝公钥" prop="alipayPublicKey" >
          <a-textarea :disabled="showable" v-model="form.alipayPublicKey" placeholder="请输入支付宝公钥内容"/>
        </a-form-model-item>
        <a-form-model-item v-show="form.authType === 2" label="应用公钥证书" prop="appCert" >
          <a-textarea :disabled="showable" v-model="form.appCert" placeholder="请输入应用公钥证书内容"/>
        </a-form-model-item>
        <a-form-model-item v-show="form.authType === 2" label="支付宝公钥证书" prop="alipayCert" >
          <a-textarea :disabled="showable" v-model="form.alipayCert" placeholder="请输入支付宝公钥证书内容">
          </a-textarea>
        </a-form-model-item>
        <a-form-model-item v-show="form.authType === 2" label="支付宝CA根证书" prop="alipayRootCert" >
          <a-textarea :disabled="showable" v-model="form.alipayRootCert" placeholder="请输入支付宝CA根证书内容">
          </a-textarea>
        </a-form-model-item>
        <a-form-model-item label="应用私钥" prop="privateKey" >
          <a-textarea :disabled="showable" v-model="form.privateKey" placeholder="请输入应用私钥内容"/>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark" >
          <a-textarea :disabled="showable" v-model="form.remark" placeholder="请输入备注"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
    <div class="drawer-button" >
      <a-button @click="handleCancel" style="margin-right: .8rem">取消</a-button>
      <a-button @click="handleOk" v-show="!showable" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, findPayWayList, get, update } from '@/api/payment/alipayConfig'

export default {
  name: 'AliPayConfigEdit',
  mixins: [FormMixin],
  data () {
    return {
      payWayList: [],
      form: {
        name: '',
        appId: '',
        notifyUrl: '',
        returnUrl: '',
        serverUrl: '',
        authType: 1,
        signType: 'RSA2',
        alipayPublicKey: '',
        appCert: '',
        alipayCert: '',
        alipayRootCert: '',
        privateKey: '',
        expireTime: 15,
        payWayList: [],
        sandbox: false,
        activity: null,
        state: '',
        remark: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        name: [ { required: true, message: '请输入配置名称' } ],
        appId: [ { required: true, message: '请输入AppId' } ],
        notifyUrl: [ { required: true, message: '请输入异步通知页面地址' } ],
        returnUrl: [ { required: true, message: '请输入同步通知页面地址' } ],
        serverUrl: [ { required: true, message: '请输入请求网关地址' } ],
        authType: [ { required: true, message: '请选择认证方式' } ],
        signType: [ { required: true, message: '请选择加密类型' } ],
        alipayPublicKey: [ { required: this.form.authType === 1, message: '请输入支付宝公钥' } ],
        appCert: [ { required: this.form.authType === 2, message: '请输入应用证书' } ],
        alipayCert: [ { required: this.form.authType === 2, message: '请输入支付宝证书' } ],
        alipayRootCert: [ { required: this.form.authType === 2, message: '请输入支付宝CA根证书' } ],
        privateKey: [ { required: true, message: '请输入支付私钥' } ],
        sandbox: [ { required: true, message: '请选择是否为沙箱环境' } ],
        expireTime: [ { required: true, message: '请输入默认超时配置' } ],
        payWayList: [ { required: true, message: '请选择支持的支付类型' } ]
      }
    }
  },
  methods: {
    edit (id, type) {
      findPayWayList().then(res => {
        this.payWayList = res.data
      })
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        get(id).then(res => {
          this.form = res.data
          this.rawForm = { ...res.data }
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
            await update({ ...this.form, ...this.diffForm(this.rawForm, this.form, 'appId', 'alipayPublicKey', 'appCert', 'alipayCert', 'alipayRootCert', 'privateKey') })
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
    }
  }
}
</script>

<style scoped>

</style>
