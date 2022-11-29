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
          <a-input :disabled="showable" v-model="form.appId" placeholder="请输入应用编号(AppId)"/>
        </a-form-model-item>
        <a-form-model-item label="AppSecret" prop="appSecret" >
          <a-input :disabled="showable" v-model="form.appSecret" placeholder="请输入AppSecret"/>
        </a-form-model-item>
        <a-form-model-item label="默认支付超时配置(分钟)" prop="expireTime" >
          <a-input-number
            :min="1"
            :max="12000"
            :step="1"
            :disabled="showable"
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
        <a-form-model-item label="p12证书" prop="p12">
          <a-upload
            v-if="!form.p12"
            :disabled="showable"
            name="file"
            :multiple="false"
            :action="uploadAction"
            :headers="tokenHeader"
            :showUploadList="false"
            @change="handleChange">
            <a-button>
              <a-icon type="upload"/>
              p12证书上传
            </a-button>
          </a-upload>
          <a-input v-else v-model="form.p12" disabled>
            <template #addonAfter v-if="!showable">
              <a-tooltip>
                <template #title>
                  删除上传的证书文件
                </template>
                <a-icon @click="removeP12" type="close-circle" />
              </a-tooltip>
            </template>
          </a-input>
        </a-form-model-item>
        <a-form-model-item label="APIv2密钥" prop="apiKeyV2">
          <a-textarea :disabled="showable" v-model="form.apiKeyV2" placeholder="请输入APIv2密钥"/>
        </a-form-model-item>
        <a-form-model-item label="APIv3密钥" prop="apiKeyV3">
          <a-textarea :disabled="showable" v-model="form.apiKeyV3" placeholder="请输入APIv3密钥"/>
        </a-form-model-item>
        <a-form-model-item label="证书(cert.pem)" prop="certPem">
          <a-textarea :disabled="showable" v-model="form.certPem" placeholder="请填入证书内容"/>
        </a-form-model-item>
        <a-form-model-item label="私钥(key.pem)" prop="keyPem">
          <a-textarea :disabled="showable" v-model="form.keyPem" placeholder="请填入私钥内容"/>
        </a-form-model-item>
        <a-form-model-item label="异步通知URL" prop="notifyUrl" >
          <a-input :disabled="showable" v-model="form.notifyUrl" placeholder="请输入异步通知URL"/>
        </a-form-model-item>
        <a-form-model-item label="同步通知URL" prop="returnUrl" >
          <a-input :disabled="showable" v-model="form.returnUrl" placeholder="请输入同步通知URL"/>
        </a-form-model-item>
        <a-form-model-item label="应用域名" prop="domain" >
          <a-input :disabled="showable" v-model="form.domain" placeholder="请输入domain"/>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remark" >
          <a-textarea :disabled="showable" v-model="form.remark" placeholder="请输入备注"/>
        </a-form-model-item>

      </a-form-model>
    </a-spin>
    <div class="drawer-button" >
      <a-button @click="handleCancel" style="margin-right: .8rem">取消</a-button>
      <a-button v-show="!showable" @click="handleOk" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { add, findPayWayList, get, update } from '@/api/payment/wechatPayConfig'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

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
        apiKeyV2: [ { required: this.form.apiVersion === 'api_v2', message: '请输入V2秘钥' } ],
        apiKeyV3: [ { required: this.form.apiVersion === 'api_v3', message: '请输入V3秘钥' } ],
        // keyPem: [ { required: true, message: '请填入私钥内容' } ],
        // certPem: [ { required: true, message: '请填入证书内容' } ],
        sandbox: [ { required: true, message: '请选择是否为沙箱环境' } ],
        expireTime: [ { required: true, message: '请输入默认超时配置' } ],
        payWayList: [ { required: true, message: '请选择支持的支付类型' } ]
      }
    },
    // 上传地址
    uploadAction () {
      return process.env.VUE_APP_API_BASE_URL + '/file/upload'
    },
    // 请求头消息
    tokenHeader () {
      // 从 localstorage 获取 token
      const token = storage.get(ACCESS_TOKEN)
      return {
        AccessToken: token
      }
    }
  },

  data () {
    return {
      payWayList: [],
      fileList: [],
      form: {
        id: null,
        name: '',
        mchId: '',
        appId: '',
        appSecret: '',
        apiVersion: 'api_v2',
        p12: null,
        apiKeyV2: '',
        apiKeyV3: '',
        keyPem: '',
        certPem: '',
        domain: '',
        notifyUrl: '',
        returnUrl: '',
        expireTime: 15,
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
            await update({ ...this.form, ...this.diffForm(this.rawForm, this.form, 'mchId', 'appId', 'appSecret', 'apiKeyV2', 'apiKeyV3', 'keyPem', 'certPem') })
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
    },
    /**
     * 文件上传
     */
    handleChange (info) {
      // 上传完毕
      if (info.file.status === 'done') {
        const res = info.file.response
        if (!res.code) {
          this.form.p12 = res.data.id
          this.$message.success(`${info.file.name} 上传成功!`)
        } else {
          this.$message.error(`${res.msg}`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error('上传失败')
      }
    },
    /**
     * 清除上传的p12证书
     */
    removeP12 () {
      this.form.p12 = null
    }
  }
}
</script>

<style scoped>

</style>
