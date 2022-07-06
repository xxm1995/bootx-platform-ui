<template>
  <a-drawer
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :mask-closable="showable"
    @close="handleCancel"
    :confirmLoading="confirmLoading">
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="form"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item label="主键" prop="id" hidden="true" >
          <a-input v-model="form.id" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="编码"
          prop="code"
        >
          <a-input v-model="form.code" :disabled="showable||form.system"/>
        </a-form-model-item>
        <a-form-model-item
          label="名称"
          prop="name"
        >
          <a-input v-model="form.name" :disabled="showable"/>
        </a-form-model-item>
        <a-form-model-item
          label="类型"
          prop="type"
        >
          <a-radio-group v-model="form.type" button-style="solid">
            <a-radio-button :value="PASSWORD">
              账号密码
            </a-radio-button>
            <a-radio-button :value="OPEN_ID">
              第三方登录
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="系统内置"
          prop="system"
        >
          <a-tag v-if="form.system" color="green">是</a-tag>
          <a-tag v-else color="red">否</a-tag>
        </a-form-model-item>
        <a-form-model-item
          label="启用状态"
          prop="enable"
        >
          <a-switch checked-children="开" un-checked-children="关" v-model="form.enable" :disabled="showable||form.system" />
        </a-form-model-item>
        <a-form-model-item
          label="启用验证码"
          prop="captcha"
        >
          <a-switch checked-children="开" un-checked-children="关" v-model="form.captcha" :disabled="showable" />
        </a-form-model-item>
        <a-form-model-item
          label="启用状态"
          prop="enable"
        >
          <a-switch checked-children="开" un-checked-children="关" v-model="form.enable" :disabled="showable||form.system" />
        </a-form-model-item>
        <a-form-model-item
          label="超时时间(分钟)"
          prop="timeout"
        >
          <a-input-number
            v-model="form.timeout"
            :disabled="showable"
            :min="5"
            :step="5"
          />
        </a-form-model-item>
        <a-form-model-item
          label="密码可错误次数"
          prop="pwdErrNum"
          v-show="form.type === PASSWORD"
        >
          <a-input-number
            v-model="form.pwdErrNum"
            :disabled="showable"
            :min="-1"
            :step="1"
          />
        </a-form-model-item>
        <a-form-model-item
          label="描述"
          prop="description"
        >
          <a-textarea v-model="form.description" :disabled="showable"/>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
    <div class="drawer-button" >
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
      </a-space>
    </div>
  </a-drawer>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { findById, add, update, existsByCode, existsByCodeNotId } from '@/api/system/loginType'
export default {
  name: 'LoginTypeEdit',
  mixins: [FormMixin],
  data () {
    return {
      OPEN_ID: 'openId',
      PASSWORD: 'password',
      form: {
        id: null,
        code: '',
        name: '',
        captcha: true,
        type: 'password',
        system: false,
        enable: true,
        modalWidth: 640,
        timeout: 5,
        pwdErrNum: -1,
        description: ''
      },
      rules: {
        code: [
          { required: true, message: '请输入终端编码' },
          { validator: this.validateCode, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入终端名称' }
        ],
        enable: [
          { required: true, message: '请选择启用状态' }
        ]
      }
    }
  },
  methods: {
    edit (id, type) {
      console.log(this.form)
      if (['edit', 'show'].includes(type)) {
        this.confirmLoading = true
        findById(id).then(res => {
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
          this.confirmLoading = false
          this.$emit('ok')
          this.visible = false
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
    async validateCode (rule, value, callback) {
      const { code, id } = this.form
      let res
      if (this.type === 'edit') {
        res = await existsByCodeNotId(code, id)
      } else {
        res = await existsByCode(code)
      }
      if (!res.data) {
        callback()
      } else {
        callback('该编码已存在!')
      }
    }
  }
}
</script>

<style scoped>

</style>
