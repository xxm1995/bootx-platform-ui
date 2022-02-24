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
        <a-form-model-item prop="id" hidden="true" />
        <a-form-model-item label="名称" prop="name" >
          <a-input :disabled="showable" v-model="form.name"/>
        </a-form-model-item>
        <a-form-model-item label="AppId" prop="appId" >
          <a-input :disabled="showable" v-model="form.appId"/>
        </a-form-model-item>
        <a-form-model-item label="异步通知URL" prop="notifyUrl" >
          <a-input :disabled="showable" v-model="form.notifyUrl"/>
        </a-form-model-item>
        <a-form-model-item label="同步通知URL" prop="returnUrl" >
          <a-input :disabled="showable" v-model="form.returnUrl"/>
        </a-form-model-item>
        <a-form-model-item label="支付网关URL" prop="serverUrl" >
          <a-input :disabled="showable" v-model="form.serverUrl"/>
        </a-form-model-item>
        <a-form-model-item label="默认支付超时配置" prop="expireTime" >
          <a-input :disabled="showable" v-model="form.expireTime">
            <template v-slot:suffix>
              <a-tooltip
                title="参照支付宝超时时间配置说明"
              >
                <a-icon type="info-circle"/>
              </a-tooltip>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="支持支付方式" prop="payTypeList">
          <a-select
            allowClear
            mode="multiple"
            :disabled="showable"
            v-model="form.payTypeList"
            :default-value="form.payTypeList"
            style="width: 100%"
            placeholder="选择支付方式"
          >
            <a-select-option v-for="o in payTypeList" :key="o.key">
              {{ o.value }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="沙箱环境" prop="sandbox" >
          <a-switch checked-children="是" un-checked-children="否" v-model="form.sandbox" :disabled="showable" />
        </a-form-model-item>
        <a-form-model-item v-show="showable" label="是否启用" prop="activity" >
          <span>{{ form.activity?"启用":"未启用" }}</span>
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
        <a-form-model-item v-show="form.authType === 1" label="公钥" prop="alipayPublicKey" >
          <a-textarea :disabled="showable" v-model="form.alipayPublicKey"/>
        </a-form-model-item>
        <a-form-model-item v-show="form.authType === 2 " label="应用公钥证书" prop="appCert" >
          <a-textarea :disabled="showable" v-model="form.appCert">
          </a-textarea>
        </a-form-model-item>
        <a-form-model-item v-show="form.authType === 2 " label="支付宝公钥证书" prop="alipayCert" >
          <a-textarea :disabled="showable" v-model="form.alipayCert">
          </a-textarea>
        </a-form-model-item>
        <a-form-model-item v-show="form.authType === 2 " label="CA根证书文件" prop="alipayRootCert" >
          <a-textarea :disabled="showable" v-model="form.alipayRootCert">
          </a-textarea>
        </a-form-model-item>
        <a-form-model-item label="私钥" prop="privateKey" >
          <a-textarea :disabled="showable" v-model="form.privateKey"/>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark" >
          <a-textarea :disabled="showable" v-model="form.remark"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
    <div class="drawer-button" >
      <a-button @click="handleCancel" style="margin-right: .8rem">取消</a-button>
      <a-button @click="handleOk" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, findPayTypeList, get, update } from '@/api/payment/alipayConfig'

export default {
  name: 'AliPayConfigEdit',
  mixins: [FormMixin],
  data () {
    return {
      payTypeList: [],
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
        expireTime: '',
        payTypeList: [],
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
        payTypeList: [ { required: true, message: '请选择支持的支付类型' } ]
      }
    },
    diff () {
      return {
        appId: this.diffForm(this.form.appId, this.rawForm.appId),
        alipayPublicKey: this.diffForm(this.form.alipayPublicKey, this.rawForm.alipayPublicKey),
        appCert: this.diffForm(this.form.appCert, this.rawForm.appCert),
        alipayCert: this.diffForm(this.form.alipayCert, this.rawForm.alipayCert),
        alipayRootCert: this.diffForm(this.form.alipayRootCert, this.rawForm.alipayRootCert),
        privateKey: this.diffForm(this.form.privateKey, this.rawForm.privateKey)
      }
    }
  },
  methods: {
    edit (id, type) {
      findPayTypeList().then(res => {
        this.payTypeList = res.data
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
            const form = {
              ...this.form,
              ...this.diff
            }
            await update(form)
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
