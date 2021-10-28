<template>
  <a-modal
    :title="title"
    :width="modalWidth"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel"
  >
    <a-descriptions
      title=""
      :column="{md: 2, sm: 1, xs: 1}"
    >
      <a-descriptions-item label="登录账号">
        {{ form.account }}
      </a-descriptions-item>
      <a-descriptions-item label="登录成功状态">
        {{ form.login?"成功":"失败" }}
      </a-descriptions-item>
      <a-descriptions-item label="登录终端">
        {{ form.client }}
      </a-descriptions-item>
      <a-descriptions-item label="登录IP地址">
        {{ form.ip }}
      </a-descriptions-item>
      <a-descriptions-item label="登录地点">
        {{ form.loginLocation }}
      </a-descriptions-item>
      <a-descriptions-item label="浏览器类型">
        {{ form.browser }}
      </a-descriptions-item>
      <a-descriptions-item label="操作系统">
        {{ form.os }}
      </a-descriptions-item>
      <a-descriptions-item label="提示消息">
        {{ form.msg }}
      </a-descriptions-item>
      <a-descriptions-item label="访问时间">
        {{ form.loginTime }}
      </a-descriptions-item>

    </a-descriptions>
    <template v-slot:footer>
      <a-button key="cancel" @click="handleCancel">取消</a-button>
    </template>
  </a-modal>
</template>

<script>
import { FormMixin } from '@/mixins/FormMixin'
import { loginInfo } from '@/api/system/log'

export default {
  name: 'LoginLogInfo',
  mixins: [ FormMixin ],
  data () {
    return {
      logBusinessType: 'LogBusinessType',
      form: {
        userId: '',
        account: '',
        login: '',
        client: '',
        ip: '',
        loginLocation: '',
        browser: '',
        os: '',
        msg: '',
        loginTime: ''
      }
    }
  },
  methods: {
    edit (id) {
      loginInfo(id).then(res => {
        this.form = res.data
      })
    }
  }
}
</script>

<style scoped>

</style>
