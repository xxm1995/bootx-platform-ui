<template>
  <a-modal
    :title="title"
    :width="840"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-descriptions
      title=""
      :column="{md: 2, sm: 1, xs: 1}"
    >
      <a-descriptions-item label="操作人员账号">
        {{ form.username }}
      </a-descriptions-item>
      <a-descriptions-item label="操作模块">
        {{ form.title }}
      </a-descriptions-item>
      <a-descriptions-item label="业务类型">
        {{ form.businessType }}
      </a-descriptions-item>
      <a-descriptions-item label="请求方式">
        {{ form.requestMethod }}
      </a-descriptions-item>
      <a-descriptions-item label="请求url">
        {{ form.operateUrl }}
      </a-descriptions-item>
      <a-descriptions-item label="操作方法">
        {{ form.method }}
      </a-descriptions-item>
      <a-descriptions-item label="操作ip">
        {{ form.operateIp }}
      </a-descriptions-item>
      <a-descriptions-item label="操作状态">
        {{ form.success?"成功":"失败" }}
      </a-descriptions-item>
      <a-descriptions-item label="提示消息">
        {{ form.errorMsg }}
      </a-descriptions-item>
      <a-descriptions-item label="请求参数">
        {{ form.operateParam }}
      </a-descriptions-item>
      <a-descriptions-item label="响应参数">
        {{ form.operateReturn }}
      </a-descriptions-item>
      <a-descriptions-item label="操作时间">
        {{ form.operateTime }}
      </a-descriptions-item>

    </a-descriptions>

    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { operateInfo } from '@/api/system/log'

export default {
  name: 'OperateLogInfo',
  mixins: [ FormMixin ],
  data () {
    return {
      logBusinessType: 'LogBusinessType',
      form: {
        operateId: '',
        username: '',
        title: '',
        businessType: '',
        method: '',
        requestMethod: '',
        operateUrl: '',
        operateIp: '',
        operateParam: '',
        operateReturn: '',
        success: '',
        errorMsg: '',
        operateTime: ''
      }
    }
  },
  methods: {
    edit (id) {
      operateInfo(id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
