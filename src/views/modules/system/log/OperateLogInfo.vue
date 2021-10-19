<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="form"
      :model="form"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item
        label="操作人员ID"
      >
        <a-input v-model="form.operateId" disabled/>
      </a-form-model-item>
      <a-form-model-item
        label="操作人员"
      >
        <a-input v-model="form.operateName" />
      </a-form-model-item>
      <a-form-model-item
        label="启用验证码"
        prop="captcha"
      >
        <a-switch checked-children="开" un-checked-children="关" v-model="form.captcha" />
      </a-form-model-item>
      <a-form-model-item
        label="启用状态"
        prop="enable"
      >
        <a-switch checked-children="开" un-checked-children="关" v-model="form.enable" />
      </a-form-model-item>
    </a-form-model>

    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
      <a-button v-if="!showable" key="forward" :loading="confirmLoading" type="primary" @click="handleOk">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { operatePage } from '@/api/system/log'

export default {
  name: 'OperateLogInfo',
  mixins: [ FormMixin ],
  data () {
    return {
      form: {
        operateId: '',
        operateName: '',
        captcha: true,
        enable: true,
        timeout: '5',
        description: ''
      }
    }
  },
  methods: {
    edit (id) {
      operatePage(id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
