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
          <a-input :disabled="showable" v-model="form.name" placeholder="请输入名称"/>
        </a-form-model-item>
        <a-form-model-item label="商户号" prop="mchId">
          <a-input :disabled="showable" v-model="form.mchId" placeholder="请输入商户号"/>
        </a-form-model-item>
        <a-form-model-item label="应用编号" prop="appId" >
          <a-input :disabled="showable" v-model="form.appId" placeholder="请输入应用编号"/>
        </a-form-model-item>
<!--        <a-form-model-item label="API版本" prop="apiVersion">-->
<!--          <a-select-->
<!--            :disabled="showable"-->
<!--            v-model="form.apiVersion"-->
<!--            :default-value="form.apiVersion"-->
<!--            style="width: 100%"-->
<!--            placeholder="选择API版本"-->
<!--          >-->
<!--            <a-select-option key="api_v2">V2</a-select-option>-->
<!--            <a-select-option key="api_v3">V3</a-select-option>-->
<!--          </a-select>-->
<!--        </a-form-model-item>-->
        <a-form-model-item label="APIv2密钥" prop="apiKeyV2">
          <a-input :disabled="showable" v-model="form.apiKeyV2" placeholder="请输入APIv2密钥"/>
        </a-form-model-item>
        <a-form-model-item label="APIv3密钥" prop="apiKeyV3">
          <a-input :disabled="showable" v-model="form.apiKeyV3" placeholder="请输入APIv3密钥"/>
        </a-form-model-item>
        <a-form-model-item label="证书(cert.pem)" prop="certPem">
          <a-textarea :disabled="showable" v-model="form.certPem" placeholder="请填入证书"/>
        </a-form-model-item>
        <a-form-model-item label="私钥(key.pem)" prop="keyPem">
          <a-textarea :disabled="showable" v-model="form.keyPem" placeholder="请填入私钥"/>
        </a-form-model-item>
        <a-form-model-item label="异步通知URL" prop="notifyUrl" >
          <a-input :disabled="showable" v-model="form.notifyUrl" placeholder="请输入备注"/>
        </a-form-model-item>
        <a-form-model-item label="同步通知URL" prop="returnUrl" >
          <a-input :disabled="showable" v-model="form.returnUrl" placeholder="请输入备注"/>
        </a-form-model-item>
        <a-form-model-item label="应用域名" prop="domain" >
          <a-input :disabled="showable" v-model="form.domain" placeholder="请输入domain"/>
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
          <span>{{ form.activity?"启用":"未启用" }}</span>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark" >
          <a-textarea :disabled="showable" v-model="form.remark" placeholder="请输入备注"/>
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
import { add, findPayWayList, get, update } from '@/api/payment/wechatPayConfig'

export default {
  name: 'WeChatConfigEdit',
  mixins: [FormMixin],
  computed: {
    rules () {
      return {
        name: [ { required: true, message: '请输入配置名称' } ],
        mchId: [ { required: true, message: '请输入商户号' } ],
        appId: [ { required: true, message: '请输入应用编号' } ],
        notifyUrl: [ { required: true, message: '请输入异步通知页面地址' } ],
        returnUrl: [ { required: true, message: '请输入同步通知页面地址' } ],
        domain: [ { required: true, message: '请输入请求应用域名' } ],
        // apiVersion: [ { required: true, message: '请选择API版本' } ],
        apiKeyV2: [ { required: this.form.apiVersion === 'api_v2', message: '请选择加密类型' } ],
        apiKeyV3: [ { required: this.form.apiVersion === 'api_v3', message: '请输入支付宝公钥' } ],
        // keyPem: [ { required: true, message: '请填入私钥内容' } ],
        // certPem: [ { required: true, message: '请填入证书内容' } ],
        sandbox: [ { required: true, message: '请选择是否为沙箱环境' } ],
        payWayList: [ { required: true, message: '请选择支持的支付类型' } ]
      }
    },
    diff () {
      return {
        mchId: this.diffForm(this.form.mchId, this.rawForm.mchId),
        appId: this.diffForm(this.form.appId, this.rawForm.appId),
        apiKeyV2: this.diffForm(this.form.apiKeyV2, this.rawForm.apiKeyV2),
        apiKeyV3: this.diffForm(this.form.apiKeyV3, this.rawForm.apiKeyV3),
        appCert: this.diffForm(this.form.appCert, this.rawForm.appCert),
        alipayCert: this.diffForm(this.form.alipayCert, this.rawForm.alipayCert),
        alipayRootCert: this.diffForm(this.form.alipayRootCert, this.rawForm.alipayRootCert),
        privateKey: this.diffForm(this.form.privateKey, this.rawForm.privateKey)
      }
    }
  },

  data () {
    return {
      payWayList: [],
      form: {
        id: null,
        name: '',
        mchId: '',
        appId: '',
        apiVersion: 'api_v2',
        apiKeyV2: '',
        apiKeyV3: '',
        appSecret: '',
        p12: '',
        keyPem: '',
        certPem: '',
        domain: '',
        notifyUrl: '',
        returnUrl: '',
        payWayList: [],
        sandbox: false,
        remark: ''
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
